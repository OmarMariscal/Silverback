import { SetMetadata } from '@nestjs/common';
import { Roles as RolesEnum } from '@domain/roles/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
