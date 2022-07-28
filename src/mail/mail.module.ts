import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
   imports: [
      MailerModule.forRootAsync({
         useFactory: () => ({
            //mailslurper
            // transport: 'smtp://user@example.com:topsecret@localhost:2500',
            // gmail
            transport: {
               host: 'smtp.gmail.com',
               port: 465,
               secure: true,
               auth: {
                  user: 'megakgrupa19@gmail.com',
                  pass: 'zlhbumnazmcaodsc',
               },
            },
            defaults: {
               from: '"Grupa 19sta" <megakgrupa19@gmail.com>',
            },
            template: {
               dir: __dirname + '/templates',
               adapter: new HandlebarsAdapter(),
               options: {
                  strict: true,
               },
            },
         }),
      }),
   ],
   providers: [MailService],
   exports: [MailService],
})
export class MailModule {}
