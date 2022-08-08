import {
   Body,
   Controller,
   Get,
   Inject,
   Param,
   Post,
   Redirect,
   UseGuards,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

import { UserService } from '../services/user.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { getUserProfileResponse, RegisterUserResponse } from '../../types/user';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../../decorators/portal-users.decorator';
import {
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiOkResponse,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
   constructor(@Inject(UserService) private userService: UserService) {}

   //============================GET ALL USERS================================
   @ApiCookieAuth()
   @ApiUnauthorizedResponse({ description: 'Unauthorized' })
   @ApiOkResponse({
      description: 'User table results',
   })
   @UseGuards(AuthGuard('jwt'))
   @Get('/')
   getAll(): Promise<User[]> {
      return this.userService.getAllUsers();
   }

   //============================GET ONE USERS================================
   @ApiOkResponse({
      description: 'One user results',
   })
   @Get('/:id')
   getOneUser(@Param('id') id: string): Promise<User> {
      return this.userService.getOneUser(id);
   }

   //============================ACTIVATE  USER================================
   @ApiCreatedResponse({
      description: 'User active true, registration token null',
   })
   @Get('/register/:userId/:registrationToken')
   @Redirect('http://localhost:3000/login', 302)
   register(
      // @Body() userPwd: RegisterUserDto,
      @Param('userId') userId: string,
      @Param('registrationToken') registrationToken: string,
   ): Promise<RegisterUserResponse> {
      // console.log('kontoler', userId, registrationToken);
      return this.userService.register(userId, registrationToken);
   }

   //===============GET CURRENT  USER PROFILE TO REDUX STORE==================
   @ApiCookieAuth()
   @ApiUnauthorizedResponse({ description: 'Unauthorized' })
   @ApiOkResponse({
      description: 'Current logged in user data to redux store',
   })
   @UseGuards(AuthGuard('jwt'))
   @Get('/current/profile')
   getCurrentUserProfile(
      @UserObj() user: User,
   ): Promise<getUserProfileResponse> {
      return this.userService.getCurrentUserProfile(user);
   }
}
