import { User } from "@/prisma/coreDb/interfaces"

// export type SafeUser = Omit<User, "password">

// export function convertToSafeUser(user: User): SafeUser {
//   const { password, ...others } = user
//   const safeUser = { ...others }
//   return safeUser
// }

export function maskUser(user: User): User {
  const maskedUser = { ...user }
  maskedUser.password = ""
  return maskedUser;
}


// export function maskUser(user: User, mask: (keyof User)|(keyof User)[]): SafeUser {
//   const safeUser = { ...user }
//   if( typeof mask === 'string'  ) {
//     delete safeUser[mask]
//   }
//   else {
//     for( const key of mask )
//       delete safeUser[key]
//   }
//   return safeUser
// }
