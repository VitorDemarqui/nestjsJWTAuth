import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      //roles foi definido dentro do decorator
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const authUser = request.user;

    //verifica se o usuario é admin ou se o usuario tem a role que foi passada no decorator
    //se o usuario não tiver a role, retorna false
    return (
      authUser!.role === Role.ADMIN || requiredRoles.includes(authUser!.role)
    );
  }
}
