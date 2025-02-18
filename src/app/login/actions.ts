'use server'

import { redirect } from 'next/navigation'
import { SignInFormSchema } from './contract'
import { cookies } from 'next/headers'
import { Session } from '@/prisma/memCache/prismaClient'
import { userService, sessionService } from '@/Services/user'
import { User } from '@/prisma/coreDb/interfaces'

const SESSION_KEY="sessionId"

/**
 * To be used in pages that require a logged in user.
 * Redirects to login page if no session is found.
 * @param redirectTo optional partial path to redirect to after login
 * @returns 
 */
export async function useSession(redirectTo?: string) {
  console.log("server hook: useSession")
  try {
    const sessionKey = (await cookies()).get(SESSION_KEY)?.value
    //console.log(`sessionKey: ${sessionKey}`)
    if( ! sessionKey ) {
      throw new Error("Session key not found in cookies")
    }
    const userId = await sessionService.verify(sessionKey)
    const user = await userService.getById(userId, true)
    return user
  }
  catch(e) {
    console.log(e)
    const param = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''
    //console.log(`redirecting to ${param}`)
    redirect(`/login${param}`)
  }
}

export async function signIn(prevState: unknown, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  // Validate form fields
  const validatedFields = SignInFormSchema.safeParse({
    email,
    password,
  })

  // set form fields state
  const respStatus = {
    email,
    password,
    errors: validatedFields.error?.flatten().fieldErrors,
    message: "",
    user: null as User | null,
  }
  // If any form fields are invalid, return field errors
  if (!validatedFields.success) {
    return respStatus
  }
 
  let user: User
  try {
    user = await userService.authenticate(
      validatedFields.data.email,
      validatedFields.data.password,
    )
  }
  catch(e) {
    console.log(JSON.stringify(e))
    respStatus.message = "Email ou password errados"
    return respStatus
  }

  let session: Session
  try {
    session = await sessionService.create(user.id)
  }
  catch(e) {
    console.log(JSON.stringify(e))
    respStatus.message = "Falha ao criar chave de sessão"
    return respStatus
  }

  (await cookies()).set({
    name: SESSION_KEY,
    value: session.key,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    // maxAge: 60 * 60 * 24, // 1 day // without maxAge it becomes session only
  })
  respStatus.user = user
  return respStatus
}

export async function signOut() {
  (await cookies()).delete({
    name: SESSION_KEY,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
  })

  redirect('/login')
}
