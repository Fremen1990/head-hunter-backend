import { IsString } from 'class-validator';

export class ImportUserDto {
   @IsString()
   email: string;

   @IsString()
   role: string;
}
