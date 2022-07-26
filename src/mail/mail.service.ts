import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { decrypt } from 'src/utils/pwd-tools';
import { User } from '../user/entities/user.entity';
import { join } from 'path';

@Injectable()
export class MailService {
   constructor(private mailerService: MailerService) {}

   async sendRegistrationLink(user: User) {
      const id = String(user.id);
      const token = String(user.registrationToken);

      await this.mailerService.sendMail({
         to: user.email,
         from: '"Support Team Group 19" <team19@megak.pl>',
         subject: 'Rejestracja w 😈 MegaK Head-Hunter 😈',
         attachments: [
            {
               filename: 'readme_logo.png',
               path: __dirname + '/assets/readme_logo.png',
               cid: 'image-name',
            },
         ],
         template: './register',
         context: {
            email: user.email,
            pass: decrypt(user.encryptedPwd),
            registrationLink: `http://localhost:8000/user/register/${id}/${token}`,
         },
      });

      return {
         user,
      };
   }

   async sendResetPasswordToken(user: User) {
      await this.mailerService.sendMail({
         to: user.email,
         from: '"Support Team Group 19" <team19@megak.pl>',
         subject: 'Zmiana hasła w 😈 MegaK Head-Hunter 😈',
         template: './change-password',
         context: {
            email: user.email,
            resetPasswordToken: user.resetPasswordToken,
         },
      });

      return {
         user,
      };
   }
}
