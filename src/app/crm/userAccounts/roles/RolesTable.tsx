'use client'

import { ActionIcon, Group, Modal, Paper } from '@mantine/core';
import { AgGridReact } from "ag-grid-react"
import { themeQuartz } from 'ag-grid-community';
import type { GridOptions } from "ag-grid-community";
import { useDisclosure } from '@mantine/hooks';
import { useRolesEditor } from './context'
import { RolePermissions } from '@/prisma/coreDb/interfaces';
import { IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo } from 'react';
import { ViewRole } from './types';
import styles from './styles.module.css';

const gridOptions: GridOptions<ViewRole> = {
  columnDefs: [
    { 
      field: 'name', 
      headerName: 'Role Name',
      sortable: true,
      flex: 2,
    },
    { 
      field: 'users',
      headerName: 'Users',
      valueGetter: (params) => params.data?.users?.length || 0,
      sortable: true,
      flex: 1,
    },
  ],
  getRowStyle: (params) => {
    return {
      backgroundColor: params.data?.hasChanges ? 'var(--mantine-color-yellow-2)' : 'transparent'
    }
  },
  rowSelection: { mode: "singleRow", checkboxes: false, enableClickSelection: true },
  getRowId: (params) => params.data?.id + '',
  suppressCellFocus: true,
  domLayout: 'autoHeight',
  headerHeight: 48,
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

  const viewRolesValues = useMemo(() => Array.from(viewRoles.values()), [viewRoles])

  const handleOnCellClicked = useCallback((event: any) => {
    console.log('Column:', event.column.getColId())
    setSelectedRoleId(event.data?.id)
  }, [setSelectedRoleId])

  return (
    <Paper withBorder p="md" radius="md">
      <Modal opened={opened} onClose={close} title="New Role" centered>
        {/* Modal content */}
      </Modal>
      <Group pb="md" justify='space-between'>
        <ActionIcon 
          variant="light" 
          size="lg" 
          color="blue" 
          aria-label="add new user"
          onClick={toggle}
        >
          <IconPlus />
        </ActionIcon>
        <ActionIcon 
          variant="light" 
          size="lg" 
          color="blue" 
          aria-label="save changes" 
          disabled={!hasTableChanges}
        >
          <IconDeviceFloppy />
        </ActionIcon>
      </Group>
      <div style={{ width: '100%' }}>
        <AgGridReact
          theme={themeQuartz} 
          debug={true}
          className={styles.rolesTable}
          gridOptions={gridOptions}
          rowData={viewRolesValues}
          onCellClicked={handleOnCellClicked}
        />
      </div>
    </Paper>
  )
}