import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthLoginDto {
   @IsString()
   @ApiProperty({
      type: String,
      description: 'The email address of the User',
      example: 'student@test.com',
   })
   email: string;

   @IsString()
   @ApiProperty({
      type: String,
      description: 'password',
      example: 'admin123 :)',
   })
   pwd: string;
}
