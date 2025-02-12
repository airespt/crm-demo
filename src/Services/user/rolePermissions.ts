import { maskUserMutate } from "@/Entities/user"
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

export async function createRole(newRole: NewRole) {
  const result = await rolesRepo.create(newRole)
  return result
}
