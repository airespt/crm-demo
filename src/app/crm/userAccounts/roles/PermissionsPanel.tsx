'use client'

import { Box, Paper, Title } from '@mantine/core'
import { useRolesEditor } from './context'
import { PermissionsTable } from './PermissionsTable'
import { UserPermissions } from '@/app/login/userPermissions'
import { useMemo } from 'react'
import { PermissionRow } from './types'
import { RolePermissions } from '@/prisma/coreDb/interfaces'

const permissionList = [
  { id: 'userAccounts', label: 'Users' },
  { id: 'rolePermissions', label: 'Roles' },
  { id: 'customers', label: 'Customers' }
] as { id: keyof RolePermissions, label: string }[]

function getPermissionRow(name: keyof RolePermissions, label: string, value = 0) {
  return {
    id: name,
    name: label,
    view: Boolean(value & UserPermissions.View),
    create: Boolean(value & UserPermissions.Create),
    modify: Boolean(value & UserPermissions.Modify),
    delete: Boolean(value & UserPermissions.Delete)
  }
}

function getPermissionValue(perm: PermissionRow) {
  return (perm.view ? UserPermissions.View : 0)
  + (perm.create ? UserPermissions.Create : 0)
  + (perm.modify ? UserPermissions.Modify : 0)
  + (perm.delete ? UserPermissions.Delete : 0)
}

export function PermissionsPanel() {
  const { selectedRoleId, viewRoles, setViewRole, originalRoles } = useRolesEditor()
  const selectedRole = useMemo(() => selectedRoleId ? viewRoles.get(selectedRoleId) : undefined, [viewRoles, selectedRoleId])
  
  const permissionsRows = useMemo(() => selectedRole 
    ? permissionList.map(perm => getPermissionRow(perm.id, perm.label, selectedRole[perm.id] as number))
    : [], [selectedRole])

  const handlePermissionChange = (permission: PermissionRow) => {
    if (!selectedRole) return
    const originalRole = originalRoles.get(selectedRoleId!)
    const newRole = {
      ...selectedRole,
      [permission.id]: getPermissionValue(permission)
    }
    newRole.hasChanges = permissionList.some(perm => originalRole?.[perm.id] !== newRole[perm.id])
    setViewRole(newRole)
  }

  return (
    <Paper shadow="xs" p="md" h="100%">
      <Title order={3} mb="sm">
        {selectedRole?.name || 'Select a role'}
      </Title>
      <Box h="calc(100% - 40px)">
        <PermissionsTable rowData={permissionsRows} onPermissionChange={handlePermissionChange} />
      </Box>
    </Paper>
  )
} 