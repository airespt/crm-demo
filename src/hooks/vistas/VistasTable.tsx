'use client'

import { AgGridReact } from "ag-grid-react"
import { ColDef, GridOptions, GridReadyEvent, RowClickedEvent, } from "ag-grid-community";
import { Dispatch, MouseEventHandler, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Button, Group, Popover } from "@mantine/core";
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
  const onGridReady = useCallback((params: GridReadyEvent) => {
    const node = params.api.getRowNode(selectedVistaId || 'default')
    node?.setSelected(true, true)
    if (node) {
      params.api.ensureNodeVisible(node, 'middle')
    }
  }, [])

  const prevSelectedVistaId = usePrevious(selectedVistaId)

  useEffect(() => {
    console.log('State changes:', {
      selectedVista: selectedVistaId,
      prevSelectedVistaId,
    });
  }, [selectedVistaId])

  const handleRowClicked = useCallback(({ data }: RowClickedEvent<VistasView, any>) => {
    //console.log('select', data?.vistaId, selectedVista?.vistaId, prevSelectedVistaId, !!setSelectedVista)
    if( !data || !setSelectedVista) return
    setSelectedVista(data.vistaId)
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

  const makeHandleDeleteVista = useCallback((data: VistasView): MouseEventHandler<HTMLButtonElement> => (event) => {
    event.stopPropagation(); // Prevent event bubbling
    //event.preventDefault()
    setVistasGroup(currentGroup => ({
      ...currentGroup,
      vistas: (currentGroup?.vistas.filter(vista => vista.vistaId !== data.vistaId) || [])
    } as VistasGroupView))
    console.log('delete', data.vistaId, selectedVistaId, prevSelectedVistaId)
    if( data.vistaId === selectedVistaId ) {
      setSelectedVista?.(prevSelectedVistaId || vistasGroup?.vistas.find(vista => vista.vistaId !== data.vistaId)?.vistaId || 'default')
      // const node = api.getRowNode(selectedVistaId || 'default')
      // node?.setSelected(true, true)
      }
  }, [selectedVistaId, vistasGroup])

  const CellRenderer = useCallback((props: { value: any, data: VistasView }) => {
    return (
      <Group justify='space-between'>
        <Group gap={'xs'}>
            {props.value}
        </Group>
        <Group gap={'xs'}>
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
      </Group>
    )
  }, [vistasGroup, makeHandleFavouriteVista, makeHandleCopyVista, makeHandleDeleteVista])

const columnDefs: ColDef<VistasView>[] = useMemo(() => [
    {
      headerName: 'Vista Name',
      field: 'label',
      flex: 1,
      cellStyle: (params: any) => {
        if (params.data.vistaId === 'default') {
          return { fontStyle: 'italic' }
        }
        return null
      },
      cellRenderer: CellRenderer,
      suppressMovable: true,
      sortable: true,
      editable: true,
    },
  ], [CellRenderer])

  const gridOptions: GridOptions<VistasView> = useMemo(() => ({
    rowSelection: { mode: "singleRow", checkboxes: false, enableClickSelection: true },
    animateRows: true,
    suppressMovableColumns: true,
    suppressCellFocus: true,
    domLayout: 'autoHeight',
    headerHeight: 48,
    getRowId: (params) => params.data?.vistaId || 'default',
    onRowClicked: handleRowClicked,
    getRowStyle: (params) => {
      return {
        backgroundColor: params.data?.hasChanges ? 'var(--mantine-color-yellow-2)' : 'transparent'
      }
    },
  }), [handleRowClicked, selectedVistaId])

  // const [rowData, selectedRow] = useMemo(() => [
  //   vistasGroup?.vistas?.map(vista => ({
  //     ...vista,
  //     //hasChanges: vista.vistaId === selectedVistaId,
  //   })) || [],
  //   { selectedRow: [selectedVistaId || 'default'] } as GridState
  // ], [vistasGroup, selectedVistaId])
  // //console.log('vistasGroup', vistasGroup)

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

