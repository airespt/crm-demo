import { UserTableData } from '../UserTableData';
import { Container } from '@mantine/core';

import { useSession } from '@/actions/auth/auth';
import { UserPermissions } from '@/actions/auth/userPermissions';
import { AccessGate } from '@/components/AccessGate';

export default async function Page() {
  const sessionUser = await useSession('/users');
  // handle new
  

  // handle edit

  // handle delete


  return (
    <AccessGate
      userAccess={sessionUser.role?.userAccounts}
      requiredPermissions={UserPermissions.View}
    >
      Users page
      <Container size="80vw" h="90vh">
        <UserTableData />
      </Container>
    </AccessGate>
  );
}
