'use client'
import { listVistas } from "@/contexts/Vistas/actions";
import { convertVistasGroupToView, VistaConfig, VistasGroupView, VistasView } from "@/contexts/Vistas/types";
import { VistaGroup } from "@/prisma/coreDb/interfaces";
import { randomId } from "@/utils";
import { ActionIcon, Group, Select } from "@mantine/core";
import { useDisclosure, usePrevious } from "@mantine/hooks";
import { IconChevronDown, IconSettings } from "@tabler/icons-react";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";

type VistasContext = {
  modalOpen: ReturnType<typeof useDisclosure>[0]
  modalHandlers: ReturnType<typeof useDisclosure>[1]
  config: VistaConfig,

  vistasGroup: VistasGroupView | null,
  setVistasGroup: Dispatch<SetStateAction<VistasGroupView | null>>,
  selectedVistaId: string | null,
  setSelectedVistaId: Dispatch<SetStateAction<string | null>>
  selectedVista?: VistasView

  vistasGroupEdit: VistasGroupView | null
  setVistasGroupEdit: Dispatch<SetStateAction<VistasGroupView | null>>,
  editedVistaId: string,
  setEditedVistaId: Dispatch<SetStateAction<string>>
  editedVista?: VistasView

  setFavourite: (id: string) => void
  copyVista: (data: VistasView) => void
  deleteVista: (id: string) => void
  setFields: (fields: string[]) => void

  VistasSelect: () => JSX.Element
}

const Context = createContext<VistasContext | null>(null)

type ProviderProps = {
  config: VistaConfig
  vistaGroup?: VistaGroup,
  children: ReactNode
}

export function VistasContextProvider({ config, vistaGroup, children } : ProviderProps) {
  const [vistasGroupView, setVistasGroupView] = useState<VistasGroupView | null>(null)
  const [selectedVistaId, setSelectedVistaId] = useState<string | null>(config.defaultVista.vistaId)
  const selectedVista = useMemo(() =>
    vistasGroupView?.vistas?.find(vista => vista.vistaId === selectedVistaId)
  , [vistasGroupView, vistasGroupView?.vistas, selectedVistaId])

  const [vistasGroupEdit, setVistasGroupEdit] = useState<VistasGroupView | null>(null)
  const [editedVistaId, setEditedVistaId] = useState<string>(config.defaultVista.vistaId)
  const editedVista = useMemo(() =>
    vistasGroupEdit?.vistas?.find(vista => vista.vistaId === editedVistaId)
  , [vistasGroupEdit, editedVistaId])

  const [modalOpen, modalHandlers] = useDisclosure(false,
    {
      onOpen: () => {
        setVistasGroupEdit({ ...vistasGroupView } as VistasGroupView)
        setEditedVistaId(selectedVista?.vistaId ?? config.defaultVista.vistaId)
       }
    }
  )

  useEffect(() => {
    const setter = (data: VistaGroup) => {
      const group = convertVistasGroupToView(data)
      if( !group.vistas || group.vistas.length === 0 ) {
        group.vistas = [config.defaultVista]
      }
      setVistasGroupView(group)
      setSelectedVistaId(data?.favouriteVista || config.defaultVista.vistaId)
    }

    if( vistaGroup ) {
      setter(vistaGroup)
    }
    else {
      listVistas(config.defaultVista.groupId).then(({ data, success }) => {
        if( data && success ) {
          setter(data)
        }
      })
    }
  }, [])
  
  const setFavourite = useCallback((id: string) => {
    setVistasGroupEdit(group => ({
      ...group,
      favouriteVista: id
    } as VistasGroupView))
  }, [])

  const copyVista = useCallback((data: VistasView) => {
    const newVista = {
      vistaId: randomId(),
      groupId: data.groupId,
      label: `${data.label}-copy`,
      fields: [...data.fields], // Create a new array for fields
    };
    // TODO: append new vista next to copied vista
    setVistasGroupEdit(group => ({
      ...group,
      vistas: [...(group?.vistas || []), newVista]
    } as VistasGroupView));
  }, [])

  const prevSelectedVistaId = usePrevious(editedVistaId)
  
  const deleteVista = useCallback((id: string) => {
    console.log('vistasGroup before delete', vistasGroupEdit)

    const vistasAfterDelete = vistasGroupEdit?.vistas.filter(vista => vista.vistaId !== id) || []
    if( id === editedVistaId ) {
      const prevVista = vistasAfterDelete.some(x => x.vistaId === prevSelectedVistaId) && prevSelectedVistaId
      const firstVista = vistasGroupEdit?.vistas.find(vista => vista.vistaId !== id)?.vistaId
      setEditedVistaId?.(prevVista || firstVista || 'default')
    }

    let favouriteVista = vistasGroupEdit?.favouriteVista
    if( id === vistasGroupEdit?.favouriteVista ) //|| vistasAfterDelete.every(x => x.vistaId !== favouriteVista) )
      favouriteVista = vistasGroupEdit?.vistas.find(vista => vista.vistaId !== id)?.vistaId

    setVistasGroupEdit(currentGroup => ({
      ...currentGroup,
      favouriteVista,
      vistas: vistasAfterDelete
    } as VistasGroupView))
    console.log('vistasGroup after delete', vistasGroupEdit)
  }, [editedVistaId, vistasGroupEdit])

  const setFields = useCallback((fields: string[]) => {
    const editIndex = vistasGroupEdit?.vistas.findIndex(x => x === editedVista) ?? -1
    if( editIndex === -1 ) return
    const newVistasList = [...vistasGroupEdit?.vistas ?? []]
    const newVista = { ...editedVista, fields } as VistasView
    newVistasList[editIndex] = newVista
    setVistasGroupEdit({
      ...vistasGroupEdit,
      vistas: newVistasList,
    } as VistasGroupView)
  }, [vistasGroupEdit, editedVista])

  const vistasComboItems = useMemo(() => vistasGroupView?.vistas?.map(vista => ({
    value: vista.vistaId,
    label: vista.label
  })), [vistasGroupView, vistasGroupView?.vistas])

  const VistasSelect = useCallback(() => {
    return (
    <Group gap={'xs'}>
      <Select
        data={vistasComboItems}
        allowDeselect={false}
        nothingFoundMessage='No vistas found'
        placeholder='Select a vista'
        rightSection={<IconChevronDown />}
        value={selectedVistaId}
        onChange={setSelectedVistaId}
      />
      <ActionIcon onClick={modalHandlers.toggle} disabled={!vistasGroupView}>
        <IconSettings />
      </ActionIcon>
    </Group>
    )
  }, [vistasComboItems, selectedVistaId])
  
  const initialValue = useMemo<VistasContext>(() => ({
    modalOpen,
    modalHandlers,
    config,

    vistasGroup: vistasGroupView,
    setVistasGroup: setVistasGroupView,
    selectedVistaId,
    setSelectedVistaId,
    selectedVista,
    
    vistasGroupEdit,
    setVistasGroupEdit,
    editedVistaId,
    setEditedVistaId,
    editedVista,

    setFavourite,
    copyVista,
    deleteVista,
    setFields,
  
    VistasSelect,
  }), [modalOpen, vistasGroupView, selectedVista, vistasGroupEdit, editedVista, VistasSelect])

  return (
    <Context.Provider value={initialValue}>
      {children}
    </Context.Provider>
  )
}

export function useVistasContext() {
  const ctx = useContext(Context)
  if( ! ctx ) {
    throw(new Error("useUserContext must be used within a ContextProvider"))
  }
  return ctx
}
