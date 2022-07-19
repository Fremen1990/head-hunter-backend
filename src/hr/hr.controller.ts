import { Controller, Get, Inject } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrResponse } from '../interfaces/hr';

@Controller('hr')
export class HrController {
   constructor(@Inject(HrService) private hrService: HrService) {}

   @Get('/')
   getAllHr(): Promise<HrResponse[]> {
      return this.hrService.getHr();
   }
}
