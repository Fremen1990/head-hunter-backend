import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminDto {
   @IsString()
   @ApiProperty({
      type: String,
      description: 'The email address of the Admin',
      example: 'admin@test.com',
   })
   email: string;

   @ApiProperty({
      type: String,
      description: 'password',
      example: 'admin123 :)',
   })
   @IsString()
   pwd: string;
}
