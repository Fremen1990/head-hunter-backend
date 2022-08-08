import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
   @IsString()
   @ApiProperty({
      type: String,
      description: 'email to confirm authentication for new password',
   })
   email: string;

   @IsString()
   @ApiProperty({
      type: String,
      description:
         'Reset password token to confirm authentication for new password',
   })
   resetPasswordToken: string;

   @IsString()
   @ApiProperty({
      type: String,
      description: 'New password after old password reset',
   })
   newPwd: string;

   @IsString()
   @ApiProperty({
      type: String,
      description: 'Confirmation for new password, check if both matches.',
   })
   newPwdConfirm: string;
}
