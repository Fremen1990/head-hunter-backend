import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetListLinkRequestDto {
   @IsString()
   @ApiProperty({
      type: String,
      description: 'The email address to find user for reset password email',
      example: 'student@test.com',
   })
   email: string;
}
