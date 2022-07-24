import { Injectable } from '@nestjs/common';
import { Hr } from './hr.entity';

@Injectable()
export class HrService {
   async getHr(): Promise<Hr[]> {
      return Hr.find();
   }
}
