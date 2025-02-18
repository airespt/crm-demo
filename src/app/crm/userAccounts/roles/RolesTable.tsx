'use client'

import { ActionIcon, Group, Modal, Paper, TextInput, Button, Stack } from '@mantine/core';
import { AgGridReact } from "ag-grid-react"
import type { GridOptions } from "ag-grid-community";
import { useDisclosure } from '@mantine/hooks';
import { useRolesEditor } from './context'
import { RolePermissions } from '@/prisma/coreDb/interfaces';
import { IconCopy, IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo } from 'react';
import { ViewRole } from './types';
import { createRole, updateRoles, deleteRole } from '@/app/crm/userAccounts/roles/actions'
import { useUserContext } from '@/contexts/UserContext';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
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
  const { loggedUser } = useUserContext()
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const { selectedRoleId, setSelectedRoleId, viewRoles, initViewRoles } = useRolesEditor()

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value: string) => (!value ? 'Role name is required' : null),
    },
  });

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


  const handleSave = useCallback(async () => {
    const changedRoles = Array.from(viewRoles.values())
      .filter(role => role.hasChanges)
      .map(({ hasChanges, users, ...role }) => role)

    if (changedRoles.length === 0) return

    const result = await updateRoles(changedRoles)
    console.log(result)
    if(result.success) {
      notifications.show({
        title: 'Success',
        message: 'Roles updated successfully',
        color: 'green'
      })
    } else {
      notifications.show({
        title: 'Error',
        message: result.error || 'Failed to update roles',
        color: 'red'
      })
    }
  }, [viewRoles, rolesData])


  const handleDelete = useCallback(async (event: any) => {
    const selectedRoleId = event.data?.id
    const result = await deleteRole(selectedRoleId)
    console.log(result)
  }, [])

  const handleSubmitCreate = async (values: { name: string }) => {
    const result = await createRole(values.name);
    
    if (result.success) {
      notifications.show({
        title: 'Success',
        message: 'Role created successfully',
        color: 'green',
      });
      form.reset();
      close();
      // Optionally refresh the roles data here
    } else {
      notifications.show({
        title: 'Error',
        message: result.error || 'Failed to create role',
        color: 'red',
      });
    }
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Modal opened={opened} onClose={close} title="New Role" centered>
        <form onSubmit={form.onSubmit(handleSubmitCreate)}>
          <Stack>
            <TextInput
              label="Role Name"
              placeholder="Enter role name"
              required
              {...form.getInputProps('name')}
            />
            <Button type="submit" fullWidth>
              Create Role
            </Button>
          </Stack>
        </form>
      </Modal>
      <Group pb="md" justify='space-between'>
        <Group justify='flex-start' gap="xs">
          <ActionIcon 
            variant="light" 
            size="lg" 
            color="blue" 
            aria-label="add new role"
            onClick={toggle}
          >
            <IconPlus />
          </ActionIcon>
          <ActionIcon 
            variant="light" 
            size="lg" 
            color="blue" 
            aria-label="copy role"
            disabled={!selectedRoleId}
            onClick={toggle}
          >
            <IconCopy />
          </ActionIcon>
        </Group>
        <ActionIcon 
          variant="light" 
          size="lg" 
          color="blue" 
          aria-label="save changes" 
          disabled={!hasTableChanges}
          onClick={handleSave}
        >
          <IconDeviceFloppy />
        </ActionIcon>
      </Group>
      <div style={{ width: '100%' }}>
        <AgGridReact
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