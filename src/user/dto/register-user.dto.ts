import { IsString } from 'class-validator';

export class RegisterUserDto {
   @IsString()
   pwd: string;
}
