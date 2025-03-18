'use client'

import { AgGridReact } from "ag-grid-react"
import { GridApi, GridReadyEvent, IRowDragItem, RowDragEndEvent } from "ag-grid-community"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Group, Overlay } from "@mantine/core"
import { useVistasContext } from "@/contexts/Vistas/VistasContext"

type GridName = 'active' | 'all'
export type FieldRow = {
  field: string
  id: string
}

export function FieldsTable() {
  const {
    config,
    editedVista,
    setFields,
  } = useVistasContext()

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

  const allFields = config.availableFields

  const sharedGridOptions = useMemo(() => ({
    columnDefs: [
      {
        headerName: 'Field Name',
        field: 'label',
        flex: 1,
      },
    ],
    defaultColDef: {
      suppressMovable: true,
      sortable: false,
    },
    suppressCellFocus: true,
    suppressMovableColumns: true,
    rowDragEntireRow: true,
    rowDragText: (params: IRowDragItem) => params.rowNode?.data.field,
  }), [])

  const makeGridRowDragEnd = useCallback((toSide: GridName) => {
    return (event: RowDragEndEvent<FieldRow>) => {
      const { node, overNode } = event
      if( !node.data ) return
      
      const fromSide: GridName = editedVista?.fields.includes(node.data.id) ? 'active' : 'all'
      const fromIndex = node.rowIndex ?? 0

      const activeFieldsLength = editedVista?.fields.length ?? 0
      const toIndex = overNode
        ? overNode.rowIndex || 0
        : toSide === 'active' ? activeFieldsLength : allFields.length - activeFieldsLength

      //console.log(fromSide, 'dragged', fromIndex, 'over', toIndex, toSide)

      if( fromSide === 'active' && toSide === 'all') {
        // remove from active
        setFields?.(editedVista?.fields.filter(x => x !== node.data!.id) ?? [])
      }
      else if( fromSide === 'all' && toSide === 'active' ) {
        // insert into active
        const tempCopy = [...editedVista?.fields ?? []]
        tempCopy.splice(toIndex, 0, node.data.id)
        setFields?.(tempCopy)
      }
      else if( fromSide === 'active' && toSide === 'active') {
        // swap in active
        const tempCopy = editedVista?.fields.filter(x => x !== node.data?.id) ?? []
        if( toIndex < fromIndex ) {
          tempCopy.splice(toIndex, 0, node.data.id)
        }
        else {
          tempCopy.splice(toIndex - 1, 0, node.data.id)
        }
        setFields?.(tempCopy)
      }
    }
  }, [editedVista])

  const allFieldsRow = useMemo(() =>
    allFields.reduce((acc, header) => {
      if( editedVista?.fields.includes(header) )
        return acc
      acc.push(header)
      return acc
    }, [] as string[]).map(header => ({
      label: header || '',
      id: header
    }))
  , [editedVista])

  const vistaFieldsRow = useMemo(() => editedVista?.fields.map((header) => ({
    label: header || '',
    id: header
  })) || [], [editedVista])

  return (
    <div style={{ height: '60vh', width: '100%', position: 'relative' }}>
      {editedVista?.vistaId === 'default' && <Overlay color="#777" backgroundOpacity={0.85} radius={'md'} p={'md'}/>}
      <Group h='60vh' grow>
        <AgGridReact
          gridOptions={sharedGridOptions}
          rowData={vistaFieldsRow}
          onRowDragEnd={makeGridRowDragEnd('active')}
          onGridReady={makeOnGridReady('active')}
          />
        <AgGridReact
          gridOptions={sharedGridOptions}
          rowData={allFieldsRow}
          onRowDragEnd={makeGridRowDragEnd('all')}
          onGridReady={makeOnGridReady('all')}
          />
      </Group>
    </div>
  )
} 
