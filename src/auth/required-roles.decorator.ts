import { SetMetadata } from "@nestjs/common"
import { Role } from "@prisma/client";

export const RequiredRoles = (...roles: Role[]) => SetMetadata("roles", roles);

//decorator - javascript - design pattern
// - documentar algo
// - influenciar o comportamento de algo
// - funciona como se fosse uma proxy//middleware

