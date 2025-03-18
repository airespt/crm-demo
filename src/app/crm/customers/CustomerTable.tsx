'use client'

import { Grid, Stack } from '@mantine/core'
import { AgGridReact } from 'ag-grid-react'
import { ColumnMovedEvent, themeBalham, type ColDef } from 'ag-grid-community'
import { Customer } from '@/prisma/sageDb/interfaces'
import { useMemo } from 'react'
import { EditVistasModal } from '@/contexts/Vistas/EditVistasModal'
import { useVistasContext } from '@/contexts/Vistas/VistasContext'

export interface CustomerTableProps {
  rowData: Customer[]
}

export function CustomerTable({ rowData }: CustomerTableProps) {
  const {
    selectedVista,
    VistasSelect,
  } = useVistasContext()

  const activeHeaders = useMemo(() => {
    return selectedVista?.fields.map(field => ({
      headerName: field,
      field,
      valueFormatter: ({ value }) => value || '',
    }) as ColDef<Customer>) ?? []
  }, [selectedVista])

  // const handleColumnMoved = useCallback((event: ColumnMovedEvent<Customer>) => {
  //   const cols = event.api.getColumnState()?.map(x => x.colId)
  //   //console.log('columns', cols)
  //   //vistaControl.
  // }, [])

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
        suppressDragLeaveHidesColumns={true}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          wrapHeaderText: true,
        }}
        //onColumnMoved={handleColumnMoved}
      />
    </Stack>
    <EditVistasModal />
    </>
  )
}
