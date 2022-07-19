import { Injectable } from '@nestjs/common';
import { HrEntity } from './hr.entity';

@Injectable()
export class HrService {
   async getHr(): Promise<HrEntity[]> {
      return HrEntity.find();
   }
}
