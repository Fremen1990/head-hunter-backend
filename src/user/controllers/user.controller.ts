import {
   Body,
   Controller,
   Get,
   Inject,
   Param,
   Post,
   UseGuards,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

import { UserService } from '../services/user.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import {
   getUserProfileResponse,
   RegisterUserResponse,
} from '../../interfaces/user';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../../decorators/portal-users.decorator';

@Controller('user')
export class UserController {
   constructor(@Inject(UserService) private userService: UserService) {}

   @UseGuards(AuthGuard('jwt'))
   @Get('/')
   getAll(): Promise<User[]> {
      return this.userService.getAllUsers();
   }

   @Get('/:id')
   getOneUser(@Param('id') id: string): Promise<User> {
      return this.userService.getOneUser(id);
   }

   @Post('/register/:userId/:registrationToken')
   register(
      @Body() userPwd: RegisterUserDto,
      @Param('userId') userId: string,
      @Param('registrationToken') registrationToken: string,
   ): Promise<RegisterUserResponse> {
      console.log('kontoler', userId, registrationToken);
      return this.userService.register(userPwd, userId, registrationToken);
   }

   // ---------------GET  USER PROFILE TO REDUX FROM  DATABASE!!-------------------------
   @UseGuards(AuthGuard('jwt'))
   @Get('/current/profile')
   getCurrentUserProfile(
      @UserObj() user: User,
   ): Promise<getUserProfileResponse> {
      return this.userService.getCurrentUserProfile(user);
   }
}
