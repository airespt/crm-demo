import { UserTableData } from '../UserTableData';
import { Container } from '@mantine/core';

import { useSession } from '@/app/login/actions';
import { UserPermissions } from '@/app/login/userPermissions';
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
