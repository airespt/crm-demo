'use client'

import { useUserContext } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ValidateLoggedUser() {
  const router = useRouter()
  const { loggedUser } = useUserContext()

  useEffect(() => {
    if (!loggedUser) {
      router.replace('/login')
    }
  })

  return null
}