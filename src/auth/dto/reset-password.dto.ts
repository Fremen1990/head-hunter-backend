import { IsString } from 'class-validator';

export class ResetPasswordDto {
   @IsString()
   resetPasswordToken: string;

   @IsString()
   newPwd: string;

   @IsString()
   newPwdConfirm: string;
}
