import { maskUserMutate } from "@/Entities/user"
import { RolePermissions, User } from "@/prisma/coreDb/interfaces"
import { rolesRepo } from "@/Repos/user"
import { NewRole } from "@/Repos/user/rolePermissions"

export async function listRoles(includeUsers = false) {
  const result = await rolesRepo.getAll(includeUsers)
  for( const role of result ) {
    role.users?.forEach( user => maskUserMutate(user) )
  }
  return result
}

export async function getRoleById(id: number, includeUsers = false) {
  const result = await rolesRepo.getBy({ id }, includeUsers)
  result.users?.forEach( user => maskUserMutate(user) )
  return result
}

export async function createRole(newRole: NewRole, user?: User) {
  const result = await rolesRepo.create(newRole)
  return result
}

export async function updateRoles(roles: RolePermissions[], user?: User) {
  const result = await Promise.all(roles.map(async ({id, users, ...role}) => {
    const result = await rolesRepo.update(id, role)
    result?.users?.forEach( user => maskUserMutate(user) )
    return result
  }))
  return result
}

export async function deleteRole(id: number, user?: User) {
  const result = await rolesRepo.delete(id)
  return result
}



