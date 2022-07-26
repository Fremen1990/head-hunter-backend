import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import e, { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { jwtKey, JwtPayload } from '../jwt.strategy';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { hashPwd, decrypt, encrypt } from '../../utils/pwd-tools';
import { User } from '../../user/entities/user.entity';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import nanoToken from '../../utils/nano-token';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthService {
   constructor(@Inject(MailService) private mailService: MailService) {}

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
         });

         if (!user) {
            throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
         }

         if (!user.active) {
            throw new HttpException(
               'This user is not registered.',
               HttpStatus.NOT_FOUND,
            );
         }

         if (user) {
            const decryptedPwd = decrypt(user.encryptedPwd);

            if (decryptedPwd !== req.pwd) {
               return res.status(400).json({ error: 'Incorrect password!' });
               throw new HttpException(
                  'Incorrect password',
                  HttpStatus.CONFLICT,
               );
            }
         }
         //

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
               id: user.id,
               email: user.email,
               role: user.role,
               token: token.accessToken,
               active: user.active,
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
      console.log(user);

      if (!user) {
         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const code = nanoToken();

      user.resetPasswordToken = code;
      await user.save();

      // throw new HttpException(
      //    `${code}`, // THIS HAS TO BE DELETED!!! ONLY FOR POSTMAN TESTING PURPOSES --!!!!!!!!!!!!
      //    // 'Reset password link sent'
      //    HttpStatus.OK,
      // );

      await this.mailService.sendResetPasswordToken(user);

      return {
         Status: `Reset password token has been sent to ${user.email}`,
      };
   }
   //---------------- CHANGE PASSWORD BASED ON RESET PASSWORD TOKEN ----------------
   async changePassword(req: ResetPasswordDto, res: e.Response) {
      const user = await User.findOneBy({ email: req.email });

      console.log('user ->', user);

      if (req.resetPasswordToken !== user.resetPasswordToken) {
         throw new HttpException(
            `Your reset password token is not correct`,
            HttpStatus.CONFLICT,
         );
      }

      if (req.newPwd !== req.newPwdConfirm) {
         throw new HttpException("Passwords don't match", HttpStatus.CONFLICT);
      }

      // user.pwdHash = hashPwd(req.newPwd);
      user.encryptedPwd = encrypt(req.newPwd);
      user.resetPasswordToken = null;
      await user.save();

      return res.status(200).json({ message: 'Password changed successfully' });
   }
}
