'use client'
import { signOut } from "@/app/login/actions";
import { User } from "@/prisma/coreDb/interfaces";
import { useLocalStorage } from "@mantine/hooks";
import { createContext, useCallback, useContext, useMemo } from "react";

type UserContext = {
  loggedUser: User | undefined;
  login: (user: User) => void;
  logout: () => void
}

const Context = createContext<UserContext | null>(null)

export function UserContextProvider({ children } : { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | undefined>({ key: 'user' } )
  
  const handleLogout = useCallback(() => {
    signOut()
    setUser(undefined)
  }, [])
  
  const initialValue = useMemo<UserContext>(() => ({
    loggedUser: user,
    login: (user: User) => setUser(user),
    logout: handleLogout,
  }), [user])

  return (
    <Context.Provider value={initialValue}>
      {children}
    </Context.Provider>
  )
}

export function useUserContext() {
  const ctx = useContext(Context)
  if( ! ctx ) {
    throw(new Error("useUserContext must be used within a ContextProvider"))
  }
  return ctx
}
