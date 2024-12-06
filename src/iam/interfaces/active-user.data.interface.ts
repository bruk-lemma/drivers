// import { Role } from 'src/users/enums/role.enum';
// import { PermissionType } from '../authorization/permission.type';

import { Role } from 'src/users/entities/role.entity';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
  userId: number;
  //permissions: PermissionType[];
}
