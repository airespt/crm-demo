import { Button, Container, Grid, Group, Modal, Stack, Title } from "@mantine/core";
import { convertVistaGroupFromView, convertVistasGroupToView, VistasGroupView } from "./types";
import { VistasTable } from "./VistasTable";
import { FieldsTable } from "./FieldsTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateGroup } from "./actions";
import { useVistas } from "./useVistas";


type EditVistasModalProps = Omit<ReturnType<typeof useVistas>, 'VistasSelect'>

export function EditVistasModal({
  modalState,
  config,
  vistasGroup,
  setVistasGroup,
  selectedVista,
  setSelectedVistaId,
}: EditVistasModalProps) {

  const [vistasGroupEdit, setVistasGroupEdit] = useState<VistasGroupView | null>(null)
  const [editedVistaId, setEditedVistaId] = useState<string | undefined>('default')
  const editedVista = useMemo(() =>
    vistasGroupEdit?.vistas?.find(vista => vista.vistaId === editedVistaId)
  , [vistasGroupEdit, editedVistaId])
  
  const [pending, setPending] = useState(false)
  const [modalOpen, modalHandlers] = modalState

  useEffect(() => {
    if( modalOpen ) {
      //console.log('init', vistasGroup)
      if( vistasGroup ) {
        setVistasGroupEdit({ ...vistasGroup })
        setEditedVistaId(selectedVista?.vistaId ?? 'default')
      }
    }
  }, [modalOpen])
  
  const handleOnCancel = useCallback(() => {
    modalHandlers.close()
  }, [])

  const handleOnSave = useCallback(async () => {
    console.log('save', vistasGroupEdit)
    if( !vistasGroupEdit ) return
    setPending(true)
    const response = await updateGroup(convertVistaGroupFromView(vistasGroupEdit))
    console.log('response', response)
    setPending(false)
    if( response.success) {
      setVistasGroup(convertVistasGroupToView(response.data!))
      setSelectedVistaId(editedVistaId ?? null)
      modalHandlers.close()
    }
    else {
      console.error('Failed to save vistas:', response.error)
    }
  }, [vistasGroupEdit, editedVistaId])

  return (
    <Modal title='Vistas Configuration'
      opened={modalOpen}
      onClose={modalHandlers.close}
      withCloseButton={false}
      size='90%'
      closeOnClickOutside={false}
    >
      <Container size='100%' p={0}>
        <Grid>
          <Grid.Col span={5}>
            <Stack gap='xs'>
              <Title order={6}>Saved Vistas</Title>
              <VistasTable
                vistasGroup={vistasGroupEdit}
                setVistasGroup={setVistasGroupEdit}
                selectedVistaId={editedVistaId}
                setSelectedVista={setEditedVistaId}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={7}>
            <Stack gap='xs'>
              <Title order={6}>Fields Configuration</Title>
              <FieldsTable
                selectedVista={editedVista}
                allFields={config.availableFields}
              />
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      <Group justify='right' mt='md'>
        <Button color='red' onClick={handleOnCancel}>
          Close
        </Button>
        <Button color='green' onClick={handleOnSave} disabled={pending}>
          Save
        </Button>
      </Group>
    </Modal>
  )
}
