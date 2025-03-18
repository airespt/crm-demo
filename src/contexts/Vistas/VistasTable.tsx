'use client'

import { AgGridReact } from "ag-grid-react"
import { CellClickedEvent, ColDef, GridApi, GridOptions, GridReadyEvent, } from "ag-grid-community";
import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Button, Center, Group, Popover } from "@mantine/core";
import { IconCopy, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { VistasView } from "./types";
import { useVistasContext } from "@/contexts/Vistas/VistasContext";

export function VistasTable() {
  const {
    vistasGroupEdit,
    editedVistaId,
    setEditedVistaId,

    setFavourite,
    copyVista,
    deleteVista,
  } = useVistasContext()

  const [gridApi, setGridApi] = useState<GridApi | null>(null) // active fields
  
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api)
    const node = params.api.getRowNode(editedVistaId || 'default')
    if (node) {
      params.api.ensureNodeVisible(node, 'middle')
    }
  }, [setGridApi])

  useEffect(() => {
    const node = gridApi?.getRowNode(editedVistaId || 'default')
    node?.setSelected(true, true)
  }, [gridApi, editedVistaId])

  const handleCellClicked = useCallback(({ data, column }: CellClickedEvent<VistasView, any>) => {
    if( column.getId() === 'buttons'  || ! data ) return
    setEditedVistaId?.(data.vistaId)
  }, [setEditedVistaId])

  const makeHandleFavouriteVista = useCallback((data: VistasView): MouseEventHandler<HTMLButtonElement> => () => {
    setFavourite(data.vistaId)
  }, [setFavourite])

  const makeHandleCopyVista = useCallback((data: VistasView): MouseEventHandler<HTMLButtonElement> => () => {
    copyVista(data)
  }, [copyVista])

  const makeHandleDeleteVista = useCallback((data: VistasView): MouseEventHandler<HTMLButtonElement> => () => {
    deleteVista(data.vistaId)
  }, [deleteVista])

  const CellRenderer = useCallback((props: { data: VistasView }) => {
    return (
      <Center>
        &nbsp;
        <Group gap={6} wrap="nowrap" mr={'xs'}>
          <ActionIcon size='sm' radius={'xl'} color={'transparent'}
                      onClick={makeHandleFavouriteVista(props.data)}>
            {props.data.vistaId === vistasGroupEdit?.favouriteVista
              ? <IconStarFilled color='var(--mantine-color-yellow-6)'/>
              : <IconStar color='var(--mantine-color-yellow-7)'/>}
          </ActionIcon>
          <ActionIcon size='sm' onClick={makeHandleCopyVista(props.data)}>
            <IconCopy />
          </ActionIcon>
            <Popover position='bottom' withArrow trapFocus>
              <Popover.Target>
                <ActionIcon color='red' size='sm' disabled={vistasGroupEdit!.vistas.length <= 1}>
                  <IconTrash />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Button color='red' onClick={makeHandleDeleteVista(props.data)}>
                  Delete
                </Button>
              </Popover.Dropdown>
            </Popover>
        </Group>
      </Center>
    )
  }, [vistasGroupEdit, makeHandleFavouriteVista, makeHandleCopyVista, makeHandleDeleteVista])

const columnDefs: ColDef<VistasView>[] = useMemo(() => [
    {
      headerName: 'Vista Name',
      field: 'label',
      flex: 1,
      cellStyle: (params: any) => params.data.vistaId === 'default'
        ? { fontStyle: 'italic' } : null,
      sortable: true,
      editable: true,
      resizable: false,
      //rowDrag: true,
    },
    {
      colId: 'buttons',
      type: 'rightAligned',
      width: 92,
      cellRenderer: CellRenderer,
      resizable: false,
      sortable: false,
    }
  ], [CellRenderer])

  const gridOptions: GridOptions<VistasView> = useMemo(() => ({
    rowSelection: { mode: "singleRow", checkboxes: false, enableClickSelection: false },
    animateRows: true,
    suppressMovableColumns: true,
    suppressCellFocus: true,
    domLayout: 'autoHeight',
    headerHeight: 48,
    getRowId: (params) => params.data?.vistaId || 'default',
    onCellClicked: handleCellClicked,
    // getRowStyle: (params) => {
    //   return {
    //     backgroundColor: params.data?.hasChanges ? 'var(--mantine-color-yellow-2)' : 'transparent'
    //   }
    // },
  }), [])

  return (
    <div style={{ height: '60vh', width: '100%' }}>
      <AgGridReact
        rowData={vistasGroupEdit?.vistas}
        columnDefs={columnDefs}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
      />
    </div>
  )
} 

