'use server'
import { Prisma, User as UserModel } from '@/prisma/coreDb/prismaClient';

import { coreDb } from '@/prisma/coreDb/client';
import { User as UserEntity } from '@/prisma/coreDb/interfaces';

export async function getAllUsers(includePermissions = false): Promise<UserEntity[]> {
  try {
    const allUsers = await coreDb.user.findMany({
      include: { role: includePermissions },
    })
    return allUsers;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return []
}

export async function getUserBy(where: Prisma.UserWhereUniqueInput, includePermissions = false) {
  try {
    const result = await coreDb.user.findUniqueOrThrow({
      where,
      include: { role: includePermissions }
    })
    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
    throw e
  }
}

export async function createUser(user: UserModel) { //}: Promise<User | null> {
  try {
    const result = await coreDb.user.create({ data: user })
    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return user
}

// export async function createUser(newUser: NewUser): Promise<User | null> {
//   // check newUser isValid
//   // check request permission 
//   try {
//     const createdUser = userService.createUser(newUser)
//     return createdUser; // for optimistic update
//   }
//   catch(e) {
//     console.log(JSON.stringify(e))
//     // return error code / message
//   }
//   return null
// }
