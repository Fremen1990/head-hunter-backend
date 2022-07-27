import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { decrypt } from 'src/utils/pwd-tools';
import { User } from '../user/user.entity';
import { join } from 'path';

@Injectable()
export class MailService {
   constructor(private mailerService: MailerService) {}

   // async sendMail(to: string, subject: string, html: string): Promise<any> {
   //    await this.mailerService.sendMail({
   //       to,
   //       subject,
   //       html,
   //    });
   // }

   async sendRegistrationLink(user: User) {
      // const api = 'http:localhost:8000';
      const id = String(user.id);
      const token = String(user.registrationToken);
      const registrationLink = join(id, token);

      await this.mailerService.sendMail({
         to: user.email,
         from: '"Support Team Group 19" <team19@megak.pl>',
         subject: 'Rejestracja w 😈 MegaK Head-Hunter 😈',
         template: './register',
         context: {
            email: user.email,
            pass: decrypt(user.encryptedPwd),
            registrationLink,
         },
      });

      return {
         user,
      };
   }
}
