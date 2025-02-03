
export function hasPermission(userPermissions = 0, permission: UserPermissions) {
  return (userPermissions & permission) === permission;
}

export enum UserPermissions {
  View = 1,
  Create = 2,
  Update = 4,
  Delete = 8,
}