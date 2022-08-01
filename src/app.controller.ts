import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminDto } from './admin/dto/admin.dto';
import { createAdminResponse } from './interfaces/admin';

export interface ApiStatus {
   apiName: string;
   message: string;
   status: string;
}

@Controller()
export class AppController {
   constructor(private readonly appService: AppService) {}

   @Get()
   apiStatus(): ApiStatus {
      return this.appService.getHello();
   }

   @Post('/create-admin')
   async createAdmin(@Body() newAdmin: AdminDto): Promise<createAdminResponse> {
      return this.appService.createAdminUser(newAdmin);
   }
}
