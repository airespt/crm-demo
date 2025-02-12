import { RolePermissions } from "@/prisma/coreDb/interfaces";

export type ViewRole = RolePermissions & {
  hasChanges?: boolean;
};

export type PermissionRow = {
  id: keyof RolePermissions;
  name: string;
  view: boolean;
  modify: boolean;
  create: boolean;
  delete: boolean;
};
