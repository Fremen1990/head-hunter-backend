import {
   Body,
   Controller,
   Get,
   Inject,
   Param,
   Patch,
   Post,
} from '@nestjs/common';
import { HrService } from '../services/hr.service';
import {
   HrCandidateAddResponse,
   HrCandidateListResponse,
   HrCandidateRemoveResponse,
} from '../../interfaces/hr';
import { ExcludedIdsDto } from '../dto/excluded-ids.dto';
import { UserObj } from '../../decorators/portal-users.decorator';
import { User } from '../../user/entities/user.entity';
import { Student } from '../../student/entities/student.entity';

@Controller('hr')
export class HrController {
   constructor(@Inject(HrService) private hrService: HrService) {}

   @Get('/candidate/list')
   candidateList(
      @Body() excludedIds: ExcludedIdsDto,
   ): Promise<HrCandidateListResponse[] | Student[]> {
      return this.hrService.getCandidatesList(excludedIds);
   }

   // @UseGuards(AuthGuard('jwt'))
   @Get('/candidate/:studentId')
   getOneCandidate(
      @Param('studentId') studentId: string,
   ): Promise<HrCandidateListResponse | Student> {
      return this.hrService.getOneCandidate(studentId);
   }

   // @UseGuards(AuthGuard('jwt'))
   @Patch('/candidate/:studentId')
   addToList(
      @UserObj() hrUser: User,
      @Param('studentId') studentId: string,
   ): Promise<HrCandidateAddResponse> {
      return this.hrService.addOneCandidateToList(hrUser, studentId);
   }

   // @UseGuards(AuthGuard('jwt'))
   @Patch('/candidate/:studentId/hire')
   removeFromList(
      @UserObj() hrUser: User,
      @Param('studentId') studentId: string,
   ): Promise<HrCandidateRemoveResponse> {
      return this.hrService.removeFromList(hrUser, studentId);
   }
}
