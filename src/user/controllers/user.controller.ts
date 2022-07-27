import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { User } from '../entities/user.entity';

import { UserService } from '../services/user.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterUserResponse } from '../../interfaces/user';

@Controller('user')
export class UserController {
   constructor(@Inject(UserService) private userService: UserService) {}

   @Post('/register/:userId/:registrationToken')
   register(
      @Body() userPwd: RegisterUserDto,
      @Param('userId') userId: string,
      @Param('registrationToken') registrationToken: string,
   ): Promise<RegisterUserResponse> {
      console.log('kontoler', userId, registrationToken);
      return this.userService.register(userPwd, userId, registrationToken);
   }
}
