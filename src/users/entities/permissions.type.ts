// permission.type.ts
export enum PermissionAction {
  Read = 'read',
  Write = 'write',
  Update = 'update',
  Delete = 'delete',
}

export type PermissionType = {
  resource: string; // e.g., 'coffee'
  action: PermissionAction; // e.g., 'read'
};

// Example of specific permissions, e.g., for different resources
export const Permissions = {
  CoffeeRead: { resource: 'coffee', action: PermissionAction.Read },
  CoffeeWrite: { resource: 'coffee', action: PermissionAction.Write },
  // Define other permissions as needed
};
