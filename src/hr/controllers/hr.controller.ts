import {
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
} from '../../types/hr';
import { UserObj } from '../../decorators/portal-users.decorator';
import { User } from '../../user/entities/user.entity';
import { Student } from '../../student/entities/student.entity';
import { AuthGuard } from '@nestjs/passport';
import { Hr } from '../entities/hr.entity';

import {
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiOkResponse,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('HR')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard('jwt'))
@Controller('hr')
export class HrController {
   constructor(@Inject(HrService) private hrService: HrService) {}

   //============================HR CANDIDATES LIST================================
   @ApiOkResponse({
      description:
         'Students list array with user data in relation to student table ',
   })
   @Get('/candidate/list')
   candidateList(): Promise<any> {
      return this.hrService.getCandidatesList();
   }

   //============================GET ONE HR ================================
   @UseGuards(AuthGuard('jwt'))
   @Get('/:hrId')
   getOneHr(@Param('hrId') hrId: string): Promise<any> {
      return this.hrService.getOneHr(hrId);
   }

   //============================HR ADD ONE CANDIDATE================================
   @ApiCookieAuth()
   @ApiCreatedResponse({ description: 'One candidate added to HR list' })
   @UseGuards(AuthGuard('jwt'))
   @Patch('/candidate/:studentId')
   addToList(
      @UserObj() hrUser: User,
      @Param('studentId') studentId: string,
   ): Promise<HrCandidateAddResponse> {
      return this.hrService.addOneCandidateToList(hrUser, studentId);
   }

   //============================HR REMOVE ONE CANDIDATE================================
   @ApiCookieAuth()
   @ApiCreatedResponse({ description: 'One candidate removed from HR list' })
   @Patch('/candidate/:studentId/hire')
   removeFromList(
      @UserObj() hrUser: User,
      @Param('studentId') studentId: string,
   ): Promise<HrCandidateRemoveResponse> {
      return this.hrService.removeFromList(hrUser, studentId);
   }
}
