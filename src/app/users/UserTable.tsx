'use client'

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
    <AgGridReact
      rowData={rowData}
      columnDefs={headers}
      //defaultColDef={defaultColDef}
    />
  )
}