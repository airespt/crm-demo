import { Prisma, RolePermissions } from '@/prisma/coreDb/prismaClient';
import { coreDb } from '@/prisma/coreDb/client';

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

export type NewRole = Omit<RolePermissions, "id">

export async function createRole(newRole: NewRole): Promise<RolePermissions | null> {
  try {
    const result = await coreDb.rolePermissions.create({ data: newRole })
    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return null
}