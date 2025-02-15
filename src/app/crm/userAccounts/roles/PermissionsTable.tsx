'use client'

import { Switch } from '@mantine/core';
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community";
import { PermissionRow } from './types';

const switchColumnWidth = 80

const headers = [
  { field: 'name', headerName: 'Permission', flex: 1 },
  { 
    field: 'view', 
    headerName: 'View',
    width: switchColumnWidth,
    sortable: false,
    cellRenderer: (params: any) => (
      <Switch 
        size="sm"
        checked={params.value}
        onChange={(event) => params.setValue(event.currentTarget.checked)}
      />
    )
  },
  { 
    field: 'create',
    headerName: 'Create',
    width: switchColumnWidth,
    sortable: false,
    cellRenderer: (params: any) => (
      <Switch 
        size="sm"
        checked={params.value}
        onChange={(event) => params.setValue(event.currentTarget.checked)}
      />
    )
  },
  { 
    field: 'modify',
    headerName: 'Modify', 
    width: switchColumnWidth,
    sortable: false,
    cellRenderer: (params: any) => (

      <Switch 
        size="sm"
        checked={params.value}
        onChange={(event) => params.setValue(event.currentTarget.checked)}
      />
    )
  },
  { 
    field: 'delete',
    headerName: 'Delete',
    width: switchColumnWidth,
    sortable: false,
    cellRenderer: (params: any) => (
      <Switch 
        size="sm"
        checked={params.value}
        onChange={(event) => params.setValue(event.currentTarget.checked)}
      />
    )
  },
] as ColDef<PermissionRow>[]

export type PermissionsTableProps = {
  rowData: PermissionRow[]
  onPermissionChange?: (permissions: PermissionRow) => void
}

export function PermissionsTable({ rowData, onPermissionChange }: PermissionsTableProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={headers}
        domLayout='autoHeight'
        suppressCellFocus={true}
        onCellValueChanged={(event) => {
          if (onPermissionChange) {
            onPermissionChange(event.data)
          }
        }}
      />
    </div>
  )
} 