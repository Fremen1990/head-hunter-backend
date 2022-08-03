import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminDto } from './admin/dto/admin.dto';
import { createAdminResponse } from './interfaces/admin';
import {
   ApiConflictResponse,
   ApiCreatedResponse,
   ApiOkResponse,
   ApiTags,
} from '@nestjs/swagger';

export interface ApiStatus {
   apiName: string;
   message: string;
   status: string;
}
@ApiTags('Main')
@Controller()
export class AppController {
   constructor(private readonly appService: AppService) {}

   @ApiOkResponse({ description: 'MegaK Head Hunter API' })
   @Get()
   apiStatus(): ApiStatus {
      return this.appService.getHello();
   }

   @ApiCreatedResponse({ description: 'Admin created' })
   @ApiConflictResponse({ description: 'Admin with this email already exist' })
   @Post('/create-admin')
   async createAdmin(@Body() newAdmin: AdminDto): Promise<createAdminResponse> {
      return this.appService.createAdminUser(newAdmin);
   }
}
