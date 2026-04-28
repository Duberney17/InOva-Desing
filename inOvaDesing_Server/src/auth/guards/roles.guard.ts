import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { rol?: string | string[] } }>();

    const rawUserRoles = request.user?.rol;
    const userRoles = Array.isArray(rawUserRoles)
      ? rawUserRoles
      : rawUserRoles
        ? [rawUserRoles]
        : [];

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
