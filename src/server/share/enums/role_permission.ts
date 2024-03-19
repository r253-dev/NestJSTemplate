import { Permission } from './permission.enum';
import { Role } from './role.enum';

export const rolePermission = {
  [Role.ADMIN]: [Permission.CREATE_ADMIN],
};
