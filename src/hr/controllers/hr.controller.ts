import {
   Body,
   Controller,
   Delete,
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
   candidateList(@UserObj() hrUser: User): Promise<getUserProfileResponse[]> {
      return this.hrService.getCandidatesList(hrUser);
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

   //============================HR GET INTERVIEWS ================================
   @ApiCookieAuth()
   @ApiCreatedResponse({
      description: 'HR is getting his/hers open inteviews list',
   })
   @UseGuards(AuthGuard('jwt'))
   @Get('/interviews')
   async showMyInterviews(@UserObj() hrUser: User): Promise<any> {
      return this.hrService.showMyInterviews(hrUser);
   }

   @Delete('/cleanup')
   async cleanUp(): Promise<any> {
      return this.hrService.removeStudentsFromInterview();
   }

   //============================HR REMOVES ONE STUDENT FROM LIST================================
   @ApiCookieAuth()
   @ApiCreatedResponse({
      description:
         'Hr is not interested by student anymore, removes him/his from interview',
   })
   @Delete('/interviews/:studentId/remove')
   removeFromList(
      @UserObj() hrUser: User,
      @Param('studentId') studentId: string,
   ): Promise<any> {
      return this.hrService.remove(hrUser, studentId);
   }

   //============================HR HIRES ONE STUDENT FROM LIST================================
   @ApiCookieAuth()
   @ApiCreatedResponse({ description: 'HR is hiring student' })
   @Patch('/interviews/:studentId/hire')
   hireStudent(
      @UserObj() hrUser: User,
      @Param('studentId') studentId: string,
   ): Promise<any> {
      return this.hrService.hire(hrUser, studentId);
   }

   //============================GET ONE HR ================================
   @UseGuards(AuthGuard('jwt'))
   @Get('/:hrId')
   getOneHr(@Param('hrId') hrId: string): Promise<any> {
      return this.hrService.getOneHr(hrId);
   }
}
