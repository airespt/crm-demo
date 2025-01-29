import { UserTable } from './UserTable';
import { ActionIcon, Container } from '@mantine/core';

import { PlusIcon } from '@/components/SvgIcons';
import { useSession } from '@/actions/users/auth';
import { userService } from '@/Services';

export default async function Page() {
  const sessionUser = await useSession();

  const allUsers = await userService.list(true);

  // handle new user
  

  // handle edit user

  // handle delete user


  return (
    <>
      <p>
        {JSON.stringify(sessionUser)}
      </p>
      Users page
      <p>
        {JSON.stringify(allUsers)}
      </p>
      <Container size="80vw" h="90vh">
        <ActionIcon aria-label="add new user">
          <PlusIcon />
        </ActionIcon>
        
        <UserTable rowData={allUsers}/>

      </Container>
    </>
  );
}
