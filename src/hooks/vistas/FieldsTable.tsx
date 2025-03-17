'use client'

import { AgGridReact } from "ag-grid-react"
import { GridApi, GridReadyEvent, IRowDragItem, RowDragEndEvent } from "ag-grid-community"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Group, Overlay } from "@mantine/core"
import { VistasView } from "./types"

type GridName = 'active' | 'all'
export type FieldRow = {
  field: string
  id: string
}

type FieldsTableProps = {
  selectedVista?: VistasView
  allFields: string[]
  //onFieldsChange?: (fields: FieldRow[]) => void;
}

export function FieldsTable({
  selectedVista,
  allFields
}: FieldsTableProps) {
  const [activeGridApi, setActiveGridApi] = useState<GridApi | null>(null) // active fields
  const [allGridApi, setAllGridApi] = useState<GridApi | null>(null) // all available fields
  const makeOnGridReady = useCallback((side: GridName) => {
    if (side === 'active') 
      return (params: GridReadyEvent) => setActiveGridApi(params.api)
    else if (side === 'all')
      return (params: GridReadyEvent) => setAllGridApi(params.api)
  }, [])
  useEffect(() => {
    if (!activeGridApi || !allGridApi) return
    const activeDropZone = activeGridApi.getRowDropZoneParams()
    const allDropZone = allGridApi.getRowDropZoneParams()
    if( activeDropZone && allDropZone) {
      activeGridApi.addRowDropZone(allDropZone)
      allGridApi.addRowDropZone(activeDropZone)
      allGridApi.removeRowDropZone(allDropZone)
    }
  }, [activeGridApi, allGridApi])

  const sharedGridOptions = useMemo(() => ({
    columnDefs: [
      {
        headerName: 'Field Name',
        field: 'field',
        flex: 1,
      },
    ],
    defaultColDef: {
      suppressMovable: true,
      sortable: false,
    },
    suppressCellFocus: true,
    suppressMovableColumns: true,
    //rowDragEntireRow: true,
    rowDragText: (params: IRowDragItem) => params.rowNode?.data.field,
  }), [])

  const makeGridRowDragEnd = useCallback((side: GridName) => {
    return (event: RowDragEndEvent) => {
      const { node, overNode } = event

      if (overNode?.data) 
        console.log('dragged', node.rowIndex, 'over', overNode.rowIndex || 0, side)
      else
        console.log('dragged', node.rowIndex, 'to end', side)

      // const draggedIndex = allFields.findIndex(f => f.id === node.data.id)
      // const targetIndex = allFields.findIndex(f => f.id === overNode.data.id)
      
      // const newFields = Array.from(allFields)
      // const [draggedItem] = newFields.splice(draggedIndex, 1)
      // newFields.splice(targetIndex, 0, draggedItem)
      
      //onFieldsChange(newFields)
    }
  }, [])

    const allFieldsRow = useMemo(() =>
      allFields.reduce((acc, header) => {
        if( selectedVista?.fields.includes(header) )
          return acc
        acc.push(header)
        return acc
      }, [] as string[]).map(header => ({
        field: header || '',
        id: header
      }))
    , [selectedVista])

    const vistaFieldsRow = useMemo(() => selectedVista?.fields.map((header) => ({
      field: header || '',
      id: header
    })) || [], [selectedVista])

  return (
    <div style={{ height: '60vh', width: '100%', position: 'relative' }}>
      {selectedVista?.vistaId === 'default' && <Overlay color="#777" backgroundOpacity={0.85} radius={'md'} p={'md'}/>}
      <Group h='60vh' grow>
        <AgGridReact
          gridOptions={sharedGridOptions}
          rowData={vistaFieldsRow}
          //onRowDragEnter={makeGridRowDragEnter('active')}
          onRowDragEnd={makeGridRowDragEnd('active')}
          onGridReady={makeOnGridReady('active')}
          />
        <AgGridReact
          gridOptions={sharedGridOptions}
          rowData={allFieldsRow}
          //onRowDragEnter={makeGridRowDragEnter('all')}
          onRowDragEnd={makeGridRowDragEnd('all')}
          onGridReady={makeOnGridReady('all')}
          />
      </Group>
    </div>
  )
} 
