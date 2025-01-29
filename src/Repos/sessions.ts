'use server'

import { Prisma, Session } from "@/prisma/memCache/prismaClient";
import { memCache } from "@/prisma/memCache/client";

function sessionExpiry(): number {
  return Date.now() + 1000 * 60 * 240 // 4 hour
}

// export async function getAllSessions(): Promise<Session[]> {
//   try {
//     const allSessions = await memCache.session.findMany()
//     return allSessions;
//   }
//   catch(e) {
//     console.log(JSON.stringify(e))
//   }
//   return []
// }

export async function getSessionByKey(key: string) {
  try {
    const result = await memCache.session.findUniqueOrThrow({
      where: { key },
    })

    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
    throw e
  }
}

// export async function getSessionBy(where?: Prisma.SessionWhereUniqueInput): Promise<Session[] | null> {
//   try {
//     const result = await memCache.session.findMany({
//       where,
//     })

//     return result;
//   }
//   catch(e) {
//     console.log(JSON.stringify(e))
//   }
//   return null
// }


export async function createSession(userId: number, source: string) {
  const result = await memCache.session.create({
    data: {
      userId,
      source,
      expireAt: sessionExpiry()
    }
  })
  return result;
}

export async function refreshSession(key: string) {
  try {
    memCache.session.update({
      where: { key },
      data: { expireAt: sessionExpiry() }
    })
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return null
}

// check logout per browser tab or all tabs
export async function deleteSession(key: string) {
  try {
    const result = await memCache.session.delete({
      where: { key }
    })

    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return null
}

export async function deleteExpiredSessions() {
  try {
    const result = await memCache.session.deleteMany({
      where: {
        expireAt: {
          lt: Date.now()
        }
      }
    })

    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return null
}