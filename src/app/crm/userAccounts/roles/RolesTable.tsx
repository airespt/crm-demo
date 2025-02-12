'use client'

import { ActionIcon, Group, Modal } from '@mantine/core';
import { AgGridReact } from "ag-grid-react"
import type { GridOptions } from "ag-grid-community";
import { useDisclosure } from '@mantine/hooks';
import { useRolesEditor } from './context'
import { RolePermissions } from '@/prisma/coreDb/interfaces';
import { IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { ViewRole } from './types';

const gridOptions: GridOptions<ViewRole> = {
  columnDefs: [
    { field: 'name', flex: 2, },
    { 
      field: 'users',
      valueGetter: (params) => params.data?.users?.length || 0,
      flex: 1,
    },
  ],
  rowClassRules: {
    'has-changes': (params) => params.data?.hasChanges || false
  },
  suppressCellFocus: true,
  domLayout: 'autoHeight'
}

export type RoleTableProps = {
  rolesData: RolePermissions[]
}

export function RolesTable({ rolesData }: RoleTableProps) {
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const { setSelectedRoleId, viewRoles, initViewRoles } = useRolesEditor()

  useEffect(() => {
    initViewRoles(rolesData)
  }, [rolesData])

  const hasTableChanges = useMemo(() => {
    return Array.from(viewRoles.values()).some(role => role.hasChanges)
  }, [viewRoles])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Modal opened={opened} onClose={close} title="New Role" centered>
        {/* Modal content */}
      </Modal>
      <Group p={3} justify='space-between'>
        <ActionIcon aria-label="add new user">
          <IconPlus onClick={toggle}/>
        </ActionIcon>
        <ActionIcon aria-label="trash user" disabled={!hasTableChanges}>
          <IconDeviceFloppy />
        </ActionIcon>
      </Group>
      <AgGridReact
        className="ag-theme-alpine"
        gridOptions={gridOptions}
        rowData={Array.from(viewRoles.values())}
        onCellClicked={(event) => {
          console.log('Column:', event.column.getColId())
          setSelectedRoleId(event.data?.id)
        }}
      />
    </div>
  )
}