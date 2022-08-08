import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
   @ApiProperty({
      type: String,
      description: 'Email address',
      example: 'student@test.com',
   })
   @IsString()
   email: string;

   @ApiProperty({
      type: String,
      description: 'Password',
      example: 'admin123! :)',
   })
   @IsString()
   pwd?: string;

   @ApiProperty({
      type: String,
      description: 'Role in the app',
      example: 'student',
   })
   @IsString()
   role: string;

   @ApiProperty({
      type: String,
      description: 'Course completion score',
      example: '3.54',
   })
   @IsNumber()
   courseCompletion: number;

   @ApiProperty({
      type: String,
      description: 'Course engagement score',
      example: '4.54',
   })
   @IsNumber()
   courseEngagement: number;

   @ApiProperty({
      type: String,
      description: 'Project degree',
      example: '5.54',
   })
   @IsNumber()
   projectDegree: number;

   @ApiProperty({
      type: String,
      description: 'Team project degree',
      example: '1.54',
   })
   @IsNumber()
   teamProjectDegree: number;

   @ApiProperty({
      type: String,
      description: 'Bonus project urls',
      example:
         '["https://github.com/Fremen1990/head-hunter-frontend", "https://github.com/Fremen1990/head-hunter-backend"]',
   })
   @IsArray()
   bonusProjectUrls: string[];
}
