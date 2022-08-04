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
import { getUserProfileResponse } from '../../types';

@ApiTags('HR')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard('jwt'))
@Controller('hr')
export class HrController {
   constructor(@Inject(HrService) private hrService: HrService) {}

   //============================HR AVAILABLE CANDIDATES LIST = ACTIVE && AVAILABLE================================
   @ApiOkResponse({
      description:
         'Students list array with user data in relation to student table ',
   })
   @Get('/candidate/list')
   candidateList(): Promise<getUserProfileResponse[]> {
      return this.hrService.getCandidatesList();
   }

   //============================HR GET ONE CANDIDATE = ACTIVE && AVAILABLE================================
   @ApiOkResponse({
      description: 'One specific student has been found',
   })
   @Get('/candidate/:studentId')
   getOneCandidate(@Param('studentId') studentId: string): Promise<any> {
      return this.hrService.getOneCandidate(studentId);
   }

   //============================HR ADD ONE CANDIDATE TO INTERVIEW================================
   @ApiCookieAuth()
   @ApiCreatedResponse({ description: 'One candidate added to HR list' })
   @UseGuards(AuthGuard('jwt'))
   @Patch('/candidate')
   addToList(
      @UserObj() hrUser: User,
      @Body('studentId') studentId: string,
      // @Param('studentId') studentId: string,
   ): Promise<HrCandidateAddResponse> {
      return this.hrService.addOneCandidateToList(hrUser, studentId);
   }

   @ApiCookieAuth()
   @ApiCreatedResponse({
      description: 'HR is getting his/hers open inteviews list',
   })
   @UseGuards(AuthGuard('jwt'))
   @Get('/interviews')
   async showMyInterviews(@UserObj() hrUser: User): Promise<any> {
      return this.hrService.showMyInterviews(hrUser);
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

   //============================GET ONE HR ================================
   @UseGuards(AuthGuard('jwt'))
   @Get('/:hrId')
   getOneHr(@Param('hrId') hrId: string): Promise<any> {
      return this.hrService.getOneHr(hrId);
   }
}
