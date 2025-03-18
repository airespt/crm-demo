import { Button, Container, Grid, Group, Modal, Stack, Title } from "@mantine/core";
import { convertVistaGroupFromView, convertVistasGroupToView } from "./types";
import { VistasTable } from "./VistasTable";
import { FieldsTable } from "./FieldsTable";
import { useCallback, useState } from "react";
import { updateGroup } from "./actions";
import { useVistasContext } from "@/contexts/Vistas/VistasContext";

export function EditVistasModal() {
  const {
    modalOpen, modalHandlers,
    setVistasGroup,
    setSelectedVistaId,
    vistasGroupEdit,
    editedVistaId,
  } = useVistasContext()

  const [pendingSave, setPendingSave] = useState(false)

  const handleOnCancel = useCallback(() => {
    modalHandlers.close()
  }, [])

  const handleOnSave = useCallback(async () => {
    console.log('save', vistasGroupEdit)
    if( !vistasGroupEdit ) return
    setPendingSave(true)
    const response = await updateGroup(convertVistaGroupFromView(vistasGroupEdit))
    console.log('response', response)
    setPendingSave(false)
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
              <VistasTable />
            </Stack>
          </Grid.Col>
          <Grid.Col span={7}>
            <Stack gap='xs'>
              <Title order={6}>Fields Configuration</Title>
              <FieldsTable />
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      <Group justify='right' mt='md' gap={'xl'}>
        <Button color='red' onClick={handleOnCancel}>
          Close
        </Button>
        <Button color='green' onClick={handleOnSave} disabled={pendingSave}>
          Save
        </Button>
      </Group>
    </Modal>
  )
}
