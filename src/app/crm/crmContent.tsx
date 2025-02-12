'use client'
import { useUserContext } from "@/contexts/UserContext";

export function CrmContent() {
  const userContext = useUserContext();

  return (
    <>
    content
    {userContext.loggedUser?.name}
    </>
  );
}