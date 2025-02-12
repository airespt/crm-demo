import { coreDb } from '@/prisma/coreDb/client';
import { Prisma, RolePermissions as ModelRolePermissions } from '@/prisma/coreDb/prismaClient';
import { RolePermissions } from '@/prisma/coreDb/interfaces';

export async function getAllRoles(includeUsers = false): Promise<RolePermissions[]> {
  try {
    const allRoles = await coreDb.rolePermissions.findMany({
      include: { users: includeUsers },
    })
    return allRoles;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return []
}

export async function getRoleBy(where: Prisma.RolePermissionsWhereUniqueInput, includeUsers = false) {
  try {
    const result = await coreDb.rolePermissions.findUniqueOrThrow({
      where,
      include: { users: includeUsers }
    })
    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
    throw e
  }
}

export type NewRole = Omit<ModelRolePermissions, "id">

export async function createRole(newRole: NewRole): Promise<ModelRolePermissions | null> {
  try {
    const result = await coreDb.rolePermissions.create({ data: newRole })
    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return null
}