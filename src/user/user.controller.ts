import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { User } from './user.entity';

import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterUserResponse } from '../interfaces/user';

@Controller('user')
export class UserController {
   constructor(@Inject(UserService) private userService: UserService) {}

   @Get('/')
   getAll(): Promise<User[]> {
      return this.userService.getAllUsers();
   }

   @Get('/:id')
   getStudent(@Param('id') id: string): Promise<User> {
      return this.userService.getOneUser(id);
   }

   //JSON Body
   // {
   // 	"pwd": 1234
   // }
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
