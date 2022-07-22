import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ImportUserResponse } from '../interfaces/user';
import { ImportUserDto } from './dto/import-user.dto';

@Controller('admin')
export class AdminController {
   constructor(@Inject(AdminService) private adminService: AdminService) {}

   @Post('/import-users')
   importUsers(
      @Body() newImportUsers: ImportUserDto,
   ): Promise<ImportUserResponse> {
      console.log('CONTROLLER IMPORT');
      return this.adminService.importUsersCsv(newImportUsers);
   }
}
