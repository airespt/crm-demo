import { maskUser } from "@/Entities/user";
import { User } from "@/prisma/coreDb/interfaces";
import { usersRepo } from "@/Repos/user";

// Only returns User when credentials are valid
export async function authenticate(email: string, password: string) {
  const user = await usersRepo.getBy({ email })
  // if( encrypt(password) !== user.password )
  //  throw Error('Wrong email/password')
  return maskUser(user)
}

export async function listUsers(includePermissions = false) {
  const result = await usersRepo.getAll(includePermissions)
  return result.map(x => maskUser(x))
}

export async function getUserById(id: number, includePermissions = false) {
  const result = await usersRepo.getBy({ id }, includePermissions)
  return maskUser(result)
}

export async function createUser(user: User) {

}
