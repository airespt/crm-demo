import { rolesRepo } from "@/Repos/user"
import { NewRole } from "@/Repos/user/rolePermissions"

export async function listRoles(includeUsers = false) {
  return await rolesRepo.getAll(includeUsers)
}

export async function getRoleById(id: number, includeUsers = false) {
  const result = await rolesRepo.getBy({ id }, includeUsers)

  return result
}

export async function createRole(newRole: NewRole) {
  const result = await rolesRepo.create(newRole)

  return result
}
