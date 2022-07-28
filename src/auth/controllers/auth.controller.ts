import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../../decorators/portal-users.decorator';
import { User } from '../../user/entities/user.entity';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResetListLinkRequestDto } from '../dto/reset-link-request.dto';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('/login')
   async login(@Body() req: AuthLoginDto, @Res() res: Response): Promise<any> {
      return this.authService.login(req, res);
   }

   @Get('/logout')
   @UseGuards(AuthGuard('jwt'))
   async logout(@UserObj() user: User, @Res() res: Response) {
      console.log({ user });
      return this.authService.logout(user, res);
   }

   @Post('/send-reset-password-link')
   async sendResetPasswordLink(@Body() email: ResetListLinkRequestDto) {
      return this.authService.sendResetPasswordLink(email);
   }

   @Post('/change-password')
   // @UseGuards(AuthGuard('jwt'))
   async changePassword(
      @UserObj() user: User,
      @Body() req: ResetPasswordDto,
      @Res() res: Response,
   ) {
      return this.authService.changePassword(user, req, res);
   }
}
