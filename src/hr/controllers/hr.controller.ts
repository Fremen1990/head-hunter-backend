import { Body, Controller, Get, Inject } from '@nestjs/common';
import { HrService } from '../services/hr.service';
import { HrCandidateListResponse } from '../../interfaces/hr';
import { ExcludedIdsDto } from '../dto/excluded-ids.dto';

@Controller('hr')
export class HrController {
   constructor(@Inject(HrService) private hrService: HrService) {}

   @Get('/candidate/list')
   candidateList(
      @Body() excludedIds: ExcludedIdsDto,
   ): Promise<HrCandidateListResponse[]> {
      return this.hrService.getCandidatesList();
   }
}
