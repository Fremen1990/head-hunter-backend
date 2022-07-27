import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import e, { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { jwtKey, JwtPayload } from '../jwt.strategy';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { hashPwd } from '../../utils/hash-pwd';
import { User } from '../../user/entities/user.entity';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import nanoToken from '../../utils/nanoToken';

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
         const emailExists = await User.findOneBy({ email: req.email });

         if (!emailExists) {
            return res.json({ error: 'Email not found' });
         }
         const user = await User.findOne({
            where: {
               email: req.email,
               pwdHash: hashPwd(req.pwd),
            },
         });
         if (!user) {
            return res.status(400).json({ error: 'Incorrect password!' });
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
            .json({
               ok: true,
               token: token.accessToken,
               user: {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                  active: user.active,
                  token: token.accessToken,
               },
            });
      } catch (e) {
         return res.status(400).json({ error: e.message });
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

   //---------------- SEND RESET PASSWORD TOKEN AND ADD TO DATABASE ----------------
   async sendResetPasswordLink({ email }) {
      const user = await User.findOneBy({ email });

      if (!user) {
         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const code = nanoToken();
      console.log('RESET PASSWORD CODE ', code);

      user.resetPasswordToken = code;
      await user.save();

      console.log('added code ', user.resetPasswordToken);

      throw new HttpException(
         `${code}`, // THIS HAS TO BE DELETED!!! ONLY FOR POSTMAN TESTING PURPOSES --!!!!!!!!!!!!
         // 'Reset password link sent'
         HttpStatus.OK,
      );
   }
   //---------------- CHANGE PASSWORD BASED ON RESET PASSWORD TOKEN ----------------
   async changePassword(user: User, req: ResetPasswordDto, res: e.Response) {
      if (req.resetPasswordToken !== user.resetPasswordToken) {
         throw new HttpException(
            `Your reset password token is not correct`,
            HttpStatus.CONFLICT,
         );
      }

      if (req.newPwd !== req.newPwdConfirm) {
         throw new HttpException("Passwords don't match", HttpStatus.CONFLICT);
      }

      user.pwdHash = hashPwd(req.newPwd);
      user.resetPasswordToken = null;
      await user.save();

      return res.status(200).json({ message: 'Password changed successfully' });
   }
}
