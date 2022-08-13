import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { UserObj } from '../../decorators/portal-users.decorator';
import { User } from '../../user/entities/user.entity';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResetListLinkRequestDto } from '../dto/reset-link-request.dto';
import {
   ApiBody,
   ApiConflictResponse,
   ApiCookieAuth,
   ApiCreatedResponse,
   ApiNotFoundResponse,
   ApiOkResponse,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserResponse } from '../../types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   //============================LOGIN================================
   @ApiCreatedResponse({
      description: 'User login',
   })
   @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
   @ApiNotFoundResponse({ description: 'Email not found' })
   @ApiNotFoundResponse({ description: 'This user is not registered' })
   @ApiBody({ type: AuthLoginDto })
   @Post('/login')
   async login(
      @Body() req: AuthLoginDto,
      @Res() res: Response,
   ): Promise<LoginUserResponse> {
      return this.authService.login(req, res);
   }

   //============================LOGOUT================================
   @ApiOkResponse({ description: 'User logout' })
   @ApiUnauthorizedResponse({ description: 'Unauthorized' })
   @Get('/logout')
   async logout(@UserObj() user: User, @Res() res: Response) {
      console.log({ user });
      return this.authService.logout(user, res);
   }

   //============================SEND-RESET-PASSWORD================================
   @ApiCookieAuth()
   @ApiOkResponse({ description: 'Send reset password' })
   @ApiUnauthorizedResponse({ description: 'Unauthorized' })
   @Post('/send-reset-password-link')
   @ApiBody({ type: ResetListLinkRequestDto })
   async sendResetPasswordLink(@Body() email: ResetListLinkRequestDto) {
      return this.authService.sendResetPasswordLink(email);
   }

   //============================CHANGE-PASSWORD================================
   @ApiOkResponse({ description: 'Password changed successfully' })
   @ApiCookieAuth()
   @ApiConflictResponse({
      description: 'Your reset password token is not correct',
   })
   @ApiUnauthorizedResponse({ description: 'Unauthorized' })
   @ApiBody({ type: ResetPasswordDto })
   @Post('/change-password')
   async changePassword(
      // @UserObj() user: User,
      @Body() req: ResetPasswordDto,
      @Res() res: Response,
   ) {
      // return this.authService.changePassword(user, req, res);
      return this.authService.changePassword(req, res);
   }
}
