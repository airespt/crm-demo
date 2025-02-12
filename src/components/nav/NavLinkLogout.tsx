'use client'

import { useUserContext } from "@/contexts/UserContext";
import { NavLink } from "@mantine/core";

export function NavLinkLogout() {
  const { logout } = useUserContext();
  return <NavLink label="Logout" onClick={logout} />  
}