import { UserTableData } from './UserTableData';
import { Container } from '@mantine/core';

import { useSession } from '@/actions/auth/auth';
import { UserPermissions } from '@/actions/auth/userPermissions';
import { AccessGate } from '@/components/AccessGate';

export default async function Page() {
  const sessionUser = await useSession('/users');
  // handle new user
  

  // handle edit user

  // handle delete user


  return (
    <AccessGate
      userAccess={sessionUser.role?.accessUsers}
      requiredPermissions={UserPermissions.View}
    >
      Users page
      <Container size="80vw" h="90vh">
        <UserTableData />
      </Container>
    </AccessGate>
  );
}
