import {
   Body,
   Controller,
   Get,
   Inject,
   Param,
   Patch,
   Post,
   UseGuards,
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
import { AuthGuard } from '@nestjs/passport';
import { Hr } from '../entities/hr.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('hr')
export class HrController {
   constructor(@Inject(HrService) private hrService: HrService) {}

   // @Get('/candidate/list')
   // candidateList(
   //    @Body() excludedIds: ExcludedIdsDto,
   // ): Promise<HrCandidateListResponse[] | Student[]> {
   //    return this.hrService.getCandidatesList(excludedIds);
   // }

   @Get('/candidate/list')
   candidateList(): Promise<any> {
      return this.hrService.getCandidatesList();
   }

   // @Get('/candidate/:studentId')
   // getOneCandidate(
   //    @Param('studentId') studentId: string,
   // ): Promise<HrCandidateListResponse | Student> {
   //    return this.hrService.getOneCandidate(studentId);
   // }

   @UseGuards(AuthGuard('jwt'))
   @Get('/candidate/:studentId')
   getOneCandidate(@Param('studentId') studentId: string): Promise<any> {
      return this.hrService.getOneCandidate(studentId);
   }

   @UseGuards(AuthGuard('jwt'))
   @Get('/:hrId')
   getOneHr(@Param('hrId') hrId: string): Promise<any> {
      return this.hrService.getOneHr(hrId);
   }

   // @Patch('/candidate/:studentId')
   // addToList(
   //    @UserObj() hrUser: User,
   //    @Param('studentId') studentId: string,
   // ): Promise<HrCandidateAddResponse> {
   //    return this.hrService.addOneCandidateToList(hrUser, studentId);
   // }

   @UseGuards(AuthGuard('jwt'))
   @Post('/candidate/:studentId')
   addToList(
      @UserObj() user: User,
      @Param('studentId') studentId: string,
   ): Promise<any> {
      return this.hrService.addOneCandidateToList(user, studentId);
   }

   @Patch('/candidate/:studentId/hire')
   removeFromList(
      @UserObj() hrUser: User,
      @Param('studentId') studentId: string,
   ): Promise<HrCandidateRemoveResponse> {
      return this.hrService.removeFromList(hrUser, studentId);
   }
}
