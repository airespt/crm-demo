'use client'

import { AgGridReact } from "ag-grid-react"
import { CellClickedEvent, ColDef, GridApi, GridOptions, GridReadyEvent, RowClickedEvent, SelectionChangedEvent, } from "ag-grid-community";
import { Dispatch, MouseEventHandler, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Button, Center, Group, Popover } from "@mantine/core";
import { IconCopy, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { VistasGroupView, VistasView } from "./types";
import { randomId } from "@/utils";
import { usePrevious } from "@mantine/hooks";

// export type VistaRow = VistasView & {
//   hasChanges?: boolean
// }

type VistasTableProps = {
  vistasGroup: VistasGroupView | null;
  setVistasGroup: Dispatch<SetStateAction<VistasGroupView | null>>
  selectedVistaId?: string
  setSelectedVista?: Dispatch<SetStateAction<string | undefined>>
}

export function VistasTable({ vistasGroup, setVistasGroup, selectedVistaId, setSelectedVista }: VistasTableProps) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null) // active fields
  
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api)
    const node = params.api.getRowNode(selectedVistaId || 'default')
    if (node) {
      params.api.ensureNodeVisible(node, 'middle')
    }
  }, [])

  useEffect(() => {
    // console.log('State changes:', {
    //   selectedVista: selectedVistaId,
    //   prevSelectedVistaId,
    // });
    const node = gridApi?.getRowNode(selectedVistaId || 'default')
    node?.setSelected(true, true)

  }, [gridApi, selectedVistaId])

  const handleCellClicked = useCallback(({ data, node, column }: CellClickedEvent<VistasView, any>) => {
    if( column.getId() === 'buttons' ) return
    setSelectedVista?.(data?.vistaId)
  }, [])

  const makeHandleFavouriteVista = useCallback((data: VistasView): MouseEventHandler<HTMLButtonElement> => (event) => {
    event.stopPropagation(); // Prevent event bubbling
    setVistasGroup(currentGroup => ({
      ...currentGroup,
      favouriteVista: data.vistaId
    } as VistasGroupView))
  }, [])

  const makeHandleCopyVista = useCallback((data: VistasView): MouseEventHandler<HTMLButtonElement> => (event) => {
    event.stopPropagation(); // Prevent event bubbling
    const newVista = {
      vistaId: randomId(),
      groupId: data.groupId,
      label: `${data.label}-copy`,
      fields: [...data.fields], // Create a new array for fields
    };

    setVistasGroup(currentGroup => ({
      ...currentGroup,
      vistas: [...(currentGroup?.vistas || []), newVista]
    } as VistasGroupView));
  }, [])

  const prevSelectedVistaId = usePrevious(selectedVistaId)

  const makeHandleDeleteVista = useCallback((data: VistasView): MouseEventHandler<HTMLButtonElement> => (event) => {
    event.stopPropagation(); // Prevent event bubbling

    const vistasAfterDelete = vistasGroup?.vistas.filter(vista => vista.vistaId !== data.vistaId) || []
    if( data.vistaId === selectedVistaId ) {
      const prevVista = vistasAfterDelete.some(x => x.vistaId === prevSelectedVistaId) && prevSelectedVistaId
      const firstVista = vistasGroup?.vistas.find(vista => vista.vistaId !== data.vistaId)?.vistaId
      setSelectedVista?.(prevVista || firstVista || 'default')
    }

    let favouriteVista = vistasGroup?.favouriteVista
    if( data.vistaId === vistasGroup?.favouriteVista || vistasAfterDelete.every(x => x.vistaId !== favouriteVista) )
      favouriteVista = vistasGroup?.vistas.find(vista => vista.vistaId !== data.vistaId)?.vistaId

    setVistasGroup(currentGroup => ({
      ...currentGroup,
      favouriteVista,
      vistas: vistasAfterDelete
    } as VistasGroupView))


  }, [selectedVistaId, vistasGroup])

  const CellRenderer = useCallback((props: { value: any, data: VistasView }) => {
    return (
      <Center>
        &nbsp;
        <Group gap={6} wrap="nowrap" mr={'xs'}>
          <ActionIcon size='sm' radius={'xl'} color={'transparent'}
                      onClick={makeHandleFavouriteVista(props.data)}>
            {props.data.vistaId === vistasGroup?.favouriteVista
              ? <IconStarFilled color='var(--mantine-color-yellow-6)'/>
              : <IconStar color='var(--mantine-color-yellow-7)'/>}
          </ActionIcon>
          <ActionIcon size='sm' onClick={makeHandleCopyVista(props.data)}>
            <IconCopy />
          </ActionIcon>
            <Popover position='bottom' withArrow trapFocus>
              <Popover.Target>
                <ActionIcon color='red' size='sm' disabled={vistasGroup!.vistas.length <= 1}>
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
  }, [vistasGroup, makeHandleFavouriteVista, makeHandleCopyVista, makeHandleDeleteVista])

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
      rowDrag: true,
    },
    { //buttons column
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
    getRowStyle: (params) => {
      return {
        backgroundColor: params.data?.hasChanges ? 'var(--mantine-color-yellow-2)' : 'transparent'
      }
    },
  }), [])

  return (
    <div style={{ height: '60vh', width: '100%' }}>
      <AgGridReact
        rowData={vistasGroup?.vistas}
        columnDefs={columnDefs}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
      />
    </div>
  )
} 

