'use client'

import { AgGridReact } from "ag-grid-react"
import { ColDef, GridApi, GridOptions, GridReadyEvent, GridState, RowClassParams, RowDataUpdatedEvent } from "ag-grid-community";
import { Dispatch, MouseEventHandler, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Button, Group, Popover } from "@mantine/core";
import { IconCopy, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { VistasGroupView, VistasView } from "./types";
import { randomId } from "@/utils";

export type VistaRow = VistasView & {
  hasChanges?: boolean
}

type VistasTableProps = {
  vistasGroup: VistasGroupView | null;
  setVistasGroup: Dispatch<SetStateAction<VistasGroupView | null>>
  selectedVistaId?: string;
  onVistaSelect?: (vistaId: string) => void;
}

export function VistasTable({ vistasGroup, setVistasGroup, selectedVistaId, onVistaSelect }: VistasTableProps) {
  //const onGridReady = useCallback(() => (params: GridReadyEvent) => {
  const onGridReady = useCallback((params: RowDataUpdatedEvent) => {
    console.log('onGridReady', selectedVistaId)
    const node = params.api.getRowNode(selectedVistaId || 'default')
    if (node) {
      console.log('onGridReady', selectedVistaId)
      node.setSelected(true, true)
      params.api.ensureNodeVisible(node, 'top')
    }
  }, [selectedVistaId])

  // useEffect(() => {
  //   if (!gridApi || !vistasGroup) return
  //   const node = gridApi.getRowNode(selectedVistaId || 'default')
  //   if (node) {
  //     node.setSelected(true, true)
  //     gridApi.ensureNodeVisible(node, 'top')
  //   }
  // }, [selectedVistaId, vistasGroup])

  const makeHandleFavouriteVista = useCallback((data: VistaRow): MouseEventHandler<HTMLButtonElement> => (event) => {
    event.stopPropagation(); // Prevent event bubbling
    setVistasGroup(currentGroup => ({
      ...currentGroup,
      favouriteVista: data.vistaId
    } as VistasGroupView))
  }, [])

  const makeHandleCopyVista = useCallback((data: VistaRow): MouseEventHandler<HTMLButtonElement> => (event) => {
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

  const makeHandleDeleteVista = useCallback((data: VistaRow): MouseEventHandler<HTMLButtonElement> => (event) => {
    event.stopPropagation(); // Prevent event bubbling
    setVistasGroup(currentGroup => ({
      ...currentGroup,
      vistas: (currentGroup?.vistas.filter(vista => vista.vistaId !== data.vistaId) || [])
    } as VistasGroupView))
  }, [])

  const CellRenderer = useCallback((props: { value: any, data: VistaRow }) => {
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
  }, [vistasGroup])

const columnDefs: ColDef<VistaRow>[] = useMemo(() => [
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

  const gridOptions: GridOptions<VistaRow> = useMemo(() => ({
    rowSelection: { mode: "singleRow", checkboxes: false, enableClickSelection: true },
    animateRows: true,
    suppressMovableColumns: true,
    suppressCellFocus: true,
    domLayout: 'autoHeight',
    headerHeight: 48,
    getRowId: (params) => params.data?.vistaId || 'default',
    onRowClicked: ({ data }) => {
      //console.log('onRowClicked', data?.vistaId)
      if( !data || !onVistaSelect) return
      onVistaSelect(data.vistaId)
    },
    getRowStyle: (params) => {
      return {
        backgroundColor: params.data?.hasChanges ? 'var(--mantine-color-yellow-2)' : 'transparent'
      }
    },
  }), [])

  //const getRowClass = useCallback(({ data }: RowClassParams) => selectedVistaId === data?.vistaId ? 'ag-row-selected' : '', [selectedVistaId])
  const getRowClass = ({ data }: RowClassParams) => {
    return selectedVistaId === data?.vistaId ? 'ag-row-selected' : ''
  }

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
        //getRowClass={getRowClass}
        //onGridReady={onGridReady}
        onRowDataUpdated={onGridReady}
      />
    </div>
  )
} 

