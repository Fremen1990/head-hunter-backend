import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { jwtKey, JwtPayload } from './jwt.strategy';
import { AuthLoginDto } from './dto/auth-login.dto';
import { hashPwd } from '../utils/hash-pwd';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
   private createToken(currentTokenId: string): {
      accessToken: string;
      expiresIn: number;
   } {
      const payload: JwtPayload = { id: currentTokenId };
      const expiresIn = 60 * 60 * 24;
      const accessToken = sign(payload, jwtKey, { expiresIn });
      return {
         accessToken,
         expiresIn,
      };
   }

   private async generateToken(user: User): Promise<string> {
      let token;
      let userWithThisToken = null;
      do {
         token = uuid();
         userWithThisToken = await User.findOneBy({
            currentSessionToken: token,
         });
      } while (!!userWithThisToken);
      user.currentSessionToken = token;
      await user.save();

      return token;
   }

   async login(req: AuthLoginDto, res: Response): Promise<any> {
      try {
         const user = await User.findOneBy({
            email: req.email,
            pwdHash: hashPwd(req.pwd),
         });

         if (!user) {
            return res.json({ error: 'Invalid login data!' });
         }

         const token = await this.createToken(await this.generateToken(user));

         return res
            .cookie('jwt', token.accessToken, {
               //true jezeli uzywamy https
               secure: false,
               //domena ciastka
               domain: 'localhost',
               //FE nie widzi ciastka
               httpOnly: true,
            })
            .json({ ok: true, token: token.accessToken });
      } catch (e) {
         return res.json({ error: e.message });
      }
   }

   async logout(user: User, res: Response) {
      try {
         user.currentSessionToken = null;
         await user.save();
         res.clearCookie('jwt', {
            secure: false,
            domain: 'localhost',
            httpOnly: true,
         });
         return res.json({ ok: true });
      } catch (e) {
         return res.json({ error: e.message });
      }
   }
}
