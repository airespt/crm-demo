'use client'

import { ActionIcon, Group } from '@mantine/core';
import { PlusIcon, TrashIcon } from '@/components/SvgIcons';
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community";
import { User } from "@/prisma/coreDb/interfaces";


const headers = [
  { field: 'name', flex: 1, },
  { field: 'email', flex: 1 , filter: "agTextColumnFilter"},
  { field: 'role.name', flex: 1  }
] as ColDef<User>[]

export interface UserTableProps {
  rowData: User[]
}

export function UserTable({ rowData }: UserTableProps) {
  return (
    <>
      <Group p={3} justify='space-between'>
        <ActionIcon aria-label="add new user">
          <PlusIcon />
        </ActionIcon>
        <ActionIcon aria-label="trash user">
          <TrashIcon />
        </ActionIcon>
      </Group>
      <AgGridReact
        rowData={rowData}
        columnDefs={headers}
        //defaultColDef={defaultColDef}
      />
    </>
  )
}