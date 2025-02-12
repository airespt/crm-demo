'use client'
import { createContext, useContext, useState } from "react";
import { RolePermissions } from "@/prisma/coreDb/interfaces";
import { ViewRole } from './types'

type RolesEditorContextType = {
  originalRoles: Map<number, RolePermissions>
  viewRoles: Map<number, ViewRole>
  initViewRoles: (roles: RolePermissions[]) => void
  setViewRole: (role: ViewRole) => void
  selectedRoleId?: number
  setSelectedRoleId: (id: number | undefined) => void
}

const RolesEditorContext = createContext<RolesEditorContextType | undefined>(undefined)

export function RolesEditorContextProvider({ children }: { children: React.ReactNode }) {
  const [originalRoles, setOriginalRoles] = useState<Map<number, RolePermissions>>(new Map())
  const [viewRoles, setViewRolesState] = useState<Map<number, ViewRole>>(new Map())
  const [selectedRoleId, setSelectedRoleId] = useState<number>()

  const initViewRoles = (roles: RolePermissions[]) => {
    setOriginalRoles(new Map(roles.map(role => [role.id, role])))
    setViewRolesState(new Map(roles.map(role => [role.id, role])))
  }

  const setViewRole = (role: ViewRole) => {
    setViewRolesState(new Map(viewRoles.set(role.id, role)))
  }

  const initialValues: RolesEditorContextType = {
    originalRoles,
    viewRoles,
    initViewRoles,
    setViewRole,
    selectedRoleId,
    setSelectedRoleId
  }

  return (
    <RolesEditorContext.Provider value={initialValues}>
      {children}
    </RolesEditorContext.Provider>
  )
}

export function useRolesEditor() {
  const context = useContext(RolesEditorContext)
  if (!context) throw new Error('useRolesEditor must be used within RolesEditorContextProvider')
  return context
}
