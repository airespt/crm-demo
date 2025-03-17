'use client'

import { Grid, Stack } from '@mantine/core'
import { AgGridReact } from 'ag-grid-react'
import { themeBalham, type ColDef } from 'ag-grid-community'
import { Customer } from '@/prisma/sageDb/interfaces'
import { useState, useEffect } from 'react'
import { useVistas } from '@/hooks/vistas/useVistas'
import { vistaConfig } from './vistaConfig'
import { EditVistasModal } from '@/hooks/vistas/EditVistasModal'


export interface CustomerTableProps {
  rowData: Customer[]
}

export function CustomerTable({ rowData }: CustomerTableProps) {
  const [activeHeaders, setActiveHeaders] = useState<ColDef<Customer>[]>([])

  const { VistasSelect, ...vistaControl } = useVistas(vistaConfig)

  useEffect(() => {
    if (!vistaControl.selectedVista) return
    const activeFields = vistaControl.selectedVista.fields
    const tableFields = activeFields.map(field => ({
      headerName: field,
      field,
      valueFormatter: ({ value }) => value || '',
    }) as ColDef<Customer>)
    setActiveHeaders(tableFields)
  }, [vistaControl.selectedVista])

  return (
    <>
    <Stack h='100%' gap={0} p={'xs'} pt={6}>
      <Grid overflow='hidden' pb={'xs'}>
        <Grid.Col span={5} offset={3}>
          <VistasSelect />
        </Grid.Col>
      </Grid>
      <AgGridReact
        theme={themeBalham}
        rowData={rowData}
        columnDefs={activeHeaders}
        suppressCellFocus={true}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          wrapHeaderText: true,
        }}
      />
    </Stack>
    <EditVistasModal {...vistaControl} />
    </>
  )
}
