import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(private reflector: Reflector) {}

   canActivate(context: ExecutionContext): boolean {
      // What is the required role??
      const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
         context.getHandler(),
         context.getClass(),
      ]);

      if (!requireRoles) {
         return true;
      }

      const { user } = context.switchToHttp().getRequest();

      // const user: any = {
      //    email: 'Thoams',
      //    role: Role.ADMIN,
      // };
      console.log('USER FROM ROLES GUARD: ', user);

      return requireRoles.some((role) => user.role.includes(role));
   }
}
