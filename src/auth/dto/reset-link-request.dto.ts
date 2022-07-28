import { IsString } from 'class-validator';

export class ResetListLinkRequestDto {
   @IsString()
   email: string;
}
