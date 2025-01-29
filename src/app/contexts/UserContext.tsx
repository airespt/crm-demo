import { User } from "@/prisma/coreDb/interfaces";
import { createContext, useContext, useMemo, useState } from "react";

type UserContext = {
  loggedUser: User | null;
  login: (user: User) => void
  logout: () => void
}

const UserCtx = createContext<UserContext | null>(null)

export default function UserContextProvider({ children } : { children: React.ReactNode }) {
  const [loggedUser, setLoggedUser] = useState<User | null>(null)

  const userCtxValue = useMemo<UserContext>(() => ({
    loggedUser,
    login: (user: User) => setLoggedUser(user),
    logout: () => setLoggedUser(null),
  }), [loggedUser])

  return (
    <UserCtx.Provider value={userCtxValue}>
      {children}
    </UserCtx.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserCtx)
  if( ! context ) {
    throw(new Error("useUserContext must be used within a UserContextProvider"))
  }
  return context
}