import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HrDto {
   @ApiProperty({
      type: String,
      description: 'Email address',
      example: 'hr@test.com',
   })
   @IsString()
   email?: string;

   @ApiProperty({
      type: String,
      description: 'Password',
      example: 'admin123! :)',
   })
   @IsString()
   pwd?: string;

   @ApiProperty({
      type: String,
      description: 'Full name',
      example: 'Barlomiej Krol',
   })
   @IsString()
   fullName: string;

   @ApiProperty({
      type: String,
      description: 'Company name',
      example: 'MegaK',
   })
   @IsString()
   company: string;

   @ApiProperty({
      type: String,
      description: 'Maximum number of reserved students',
      example: '241',
   })
   @IsNumber()
   maxReservedStudents: number;
}
