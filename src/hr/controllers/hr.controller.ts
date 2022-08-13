import {
   Body,
   Controller,
   Delete,
   Get,
   Inject,
   Param,
   Patch,
   UseGuards,
} from '@nestjs/common';
import { HrService } from '../services/hr.service';
import { HrCandidateAddResponse } from '../../types';
import { UserObj } from '../../decorators/portal-users.decorator';
import { User } from '../../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

import {
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiOkResponse,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { getUserProfileResponse } from '../../types';
import { Role } from '../../enums/role.enum';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';

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
   @Roles(Role.ADMIN, Role.HR)
   @UseGuards(RolesGuard)
   @Get('/candidate/list')
   candidateList(@UserObj() hrUser: User): Promise<getUserProfileResponse[]> {
      return this.hrService.getCandidatesList(hrUser);
   }

   //============================HR AVAILABLE CANDIDATES LIST = ACTIVE && AVAILABLE - filtered================================
   @ApiOkResponse({
      description:
         'Students list array with user data in relation to student table - filtered ',
   })
   @Roles(Role.ADMIN, Role.HR)
   @UseGuards(RolesGuard)
   @Get('/candidate/list/filter')
   candidateListFiltered(
      @UserObj() hrUser: User,
      @Body() obj: any,
   ): Promise<any> {
      return this.hrService.getCandidatesListFiltered(hrUser, obj);
   }

   //============================HR GET ONE CANDIDATE = ACTIVE && AVAILABLE================================
   @ApiOkResponse({
      description: 'One specific student has been found',
   })
   @Roles(Role.ADMIN, Role.HR)
   @UseGuards(RolesGuard)
   @Get('/candidate/:studentId')
   getOneCandidate(@Param('studentId') studentId: string): Promise<any> {
      return this.hrService.getOneCandidate(studentId);
   }

   //============================HR ADD ONE CANDIDATE TO INTERVIEW================================
   @ApiCookieAuth()
   @ApiCreatedResponse({ description: 'One candidate added to HR list' })
   @Roles(Role.ADMIN, Role.HR)
   @UseGuards(RolesGuard)
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
   @Roles(Role.ADMIN, Role.HR)
   @UseGuards(RolesGuard)
   @Get('/interviews')
   async showMyInterviews(@UserObj() hrUser: User): Promise<any> {
      return this.hrService.showMyInterviews(hrUser);
   }

   //============================HR GET INTERVIEWS - FILTERED ================================
   @ApiCookieAuth()
   @ApiCreatedResponse({
      description: 'HR is getting his/hers open inteviews list - filtered',
   })
   @Roles(Role.ADMIN, Role.HR)
   @UseGuards(RolesGuard)
   @Get('/interviews/filter')
   async showMyInterviewsFiltered(
      @UserObj() hrUser: User,
      @Body() obj: any,
   ): Promise<any> {
      return this.hrService.showMyInterviewsFiltered(hrUser, obj);
   }

   // for test purpose only
   @Roles(Role.ADMIN, Role.HR)
   @UseGuards(RolesGuard)
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
   @Roles(Role.ADMIN, Role.HR)
   @UseGuards(RolesGuard)
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
   @Get('/:hrId')
   getOneHr(@Param('hrId') hrId: string): Promise<any> {
      return this.hrService.getOneHr(hrId);
   }
}
