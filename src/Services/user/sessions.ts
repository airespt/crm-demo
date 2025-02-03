'use server'

import { sessionsRepo } from "@/Repos/user"

export async function createSession(userId: number) {
  await sessionsRepo.deleteExpired()
  // single login? Also delete where userId
  return await sessionsRepo.create(userId, "")
}

// verify and refreshes expiry, and returns userId
export async function verifySession(key: string): Promise<number> {
  try {
    const session = await sessionsRepo.getByKey(key)
    // if( session.source !== source ) {
    //   throw new Error('Repository: Session source mismatch')
    // }
    if( session.expireAt < Date.now() ) {
      throw new Error('Repository: Session expired')
    }
    sessionsRepo.refresh(session.key)
    return session.userId
  }
  catch(e) {
    console.log(JSON.stringify(e))
    throw e
  }
}
