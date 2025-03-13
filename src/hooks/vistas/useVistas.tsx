import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionIcon, Group, Select } from "@mantine/core";
import { convertVistasGroupToView, VistaConfig, VistasGroupView } from "./types";
import { listVistas } from "./actions";
import { IconChevronDown, IconSettings } from "@tabler/icons-react";

/** vistas controller hook 
 * keeps a list of vistas and the selected vista.
 * handles all interactions with the vistas.
 * returns the selected vista fields to populate the table headers
 * 
 * return the vistas comboSelect.
*/
export function useVistas(config: VistaConfig) {
  const [modalOpen, modalHandlers] = useDisclosure(false)

  const [vistasGroupView, setVistasGroupView] = useState<VistasGroupView | null>(null)
  const [selectedVistaId, setSelectedVistaId] = useState<string | null>('default')
  const selectedVista = useMemo(() =>
    vistasGroupView?.vistas?.find(vista => vista.vistaId === selectedVistaId)
  , [vistasGroupView, vistasGroupView?.vistas, selectedVistaId])

  useEffect(() => {
    listVistas(config.defaultVista.groupId).then(({ data, success }) => {
      if( success && data) {
        const group = convertVistasGroupToView(data)
        if( !group.vistas || group.vistas.length === 0 ) {
          group.vistas = [config.defaultVista]
        }
        setVistasGroupView(group)
        setSelectedVistaId(data?.favouriteVista || 'default')
        //console.log('vistas loaded', group)
      }
    })
  }, [])

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
      <ActionIcon onClick={modalHandlers.toggle}>
        <IconSettings />
      </ActionIcon>
    </Group>
    )
  }, [vistasComboItems, selectedVistaId])

  return {
    modalState: [modalOpen, modalHandlers] as ReturnType<typeof useDisclosure>,
    config,
    vistasGroup: vistasGroupView,
    setVistasGroup: setVistasGroupView,
    selectedVista,
    setSelectedVistaId,
    VistasSelect,
  }
}

