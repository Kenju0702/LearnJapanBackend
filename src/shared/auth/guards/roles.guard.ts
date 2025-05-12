// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import Logger from 'src/shared/utils/Logger'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!requiredRoles) {
      return true // Nếu không có yêu cầu quyền, cho phép truy cập
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user // user từ payload của JWT
    Logger.log(user);
    Logger.log(`${requiredRoles}`);
    return requiredRoles.some(role => user.role?.includes(role)) // Kiểm tra role
  }
}
