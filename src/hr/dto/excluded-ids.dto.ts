import { IsString } from 'class-validator';

export class ExcludedIdsDto {
   @IsString()
   id: string;
}
