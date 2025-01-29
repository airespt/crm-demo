'use server'

import { redirect } from 'next/navigation'
import { SignInFormSchema } from './contract'
import { cookies } from 'next/headers'
import { Session } from '@/prisma/memCache/prismaClient'
import { userService, sessionService } from '@/Services'
import { User } from '@/prisma/coreDb/interfaces'

const SESSION_KEY="sessionId"

export async function useSession() {
  console.log("server hook: useSession")
  try {
    const sessionKey = (await cookies()).get(SESSION_KEY)?.value
    if( ! sessionKey ) {
      return null
    }
    const userId = await sessionService.verify(sessionKey)
    const user = await userService.getById(userId, true)
    return user
  }
  catch(e) {
    console.log(e)
    redirect('/login') // later, add redirect param to return to the same page requested before login
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
    message: ""
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

  // const heads = await headers()
  // for(const key of heads.keys()) {
  //   console.log(`${key}: ${heads.get(key)}`)
  // }
  let session: Session
  try{
    session = await sessionService.create(user.id)
  }
  catch(e) {
    console.log(JSON.stringify(e))
    respStatus.message = "Falha ao criar chave de sessão"
    return respStatus
  }

  (await cookies()).set({
    name: SESSION_KEY,
    value: session?.key,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    // maxAge: 60 * 60 * 24, // 1 day // no maxAge means it's removed on tab close
  })
  redirect("/users")
}

export async function signOut() {
  (await cookies()).delete({
    name: SESSION_KEY,
    // path: "/",
    // sameSite: "strict",
    // httpOnly: true,
  })

  redirect("/login")
}
