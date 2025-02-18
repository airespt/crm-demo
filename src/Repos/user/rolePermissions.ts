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
    throw e
  }
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
    throw e
  }
}

export async function updateRole(id: number, role: Prisma.RolePermissionsUpdateInput): Promise<RolePermissions | null> {
  try {
    const result = await coreDb.rolePermissions.update({
      where: { id },
      data: role,
      include: { users: true }
    })
    return result
  }
  catch(e) {
    console.log(JSON.stringify(e))
    throw e
  }
}

export async function deleteRole(id: number) {
  try {
    const result = await coreDb.rolePermissions.delete({ where: { id } })
    return result
  }
  catch(e) {
    console.log(JSON.stringify(e))
    throw e
  }
}
