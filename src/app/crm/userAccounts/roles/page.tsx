import { Paper, Grid, GridCol, Title, Stack, Box } from '@mantine/core';

import { useSession } from '@/actions/auth/auth';
import { UserPermissions } from '@/actions/auth/userPermissions';
import { AccessGate } from '@/components/AccessGate';
import { RolesPanel } from './RolesPanel';
import { useDisclosure } from '@mantine/hooks';
import { RolesEditorContextProvider } from './context';
import { PermissionsPanel } from './PermissionsPanel'

export default async function RolesPage() {
  const sessionUser = await useSession('/crm/userAccounts/roles');

  // handle new
  

  // handle edit

  // handle delete


  return (
    <AccessGate
      userAccess={sessionUser.role?.rolePermissions}
      requiredPermissions={UserPermissions.View}
    >
      <Stack h="calc(100vh - 100px)" gap="md">
        <Title order={2}>Roles Management</Title>
        <RolesEditorContextProvider>
          <Grid h="100%" w="100%">
            <GridCol span={4} miw='250px'> {/* Takes up 1/4 of the width */}
              <Paper shadow="xs" p="md" h="100%">
                <Title order={3} mb="sm">Roles</Title>
                <Box h="calc(100% - 40px)"> {/* Subtract space for title */}
                  <RolesPanel />
                </Box>
              </Paper>
            </GridCol>
            <GridCol span="auto"> {/* Takes up remaining width */}
              <PermissionsPanel />
            </GridCol>
          </Grid>
        </RolesEditorContextProvider>
      </Stack>
    </AccessGate>
  );
}
