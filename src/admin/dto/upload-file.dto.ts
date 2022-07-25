import { IsString } from 'class-validator';

export class UploadFileDto {
   @IsString()
   files: string;
}
