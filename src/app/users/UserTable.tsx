'use client'

import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community";

interface UserRowData {
  name: string,
  email: string,
  company: string,
}

export interface UserTableProps {
  rowData: UserRowData[]
  headers: ColDef<UserRowData>[]
}

export function UserTable(props: UserTableProps) {
  const { rowData, headers } = props
  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={headers}
      //defaultColDef={defaultColDef}
    />
  )
}