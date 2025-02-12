import { customerService } from "@/Services/customer";
import { Group } from "@mantine/core";

import { useSession } from '@/actions/auth/auth';
import { UserPermissions } from '@/actions/auth/userPermissions';
import { AccessGate } from '@/components/AccessGate';

export default async function Page() {
  const sessionUser = await useSession('/crm/customers');
  
  const allCustomers = await customerService.list();

  return (
    <>
      Customers page ({allCustomers.length})
      <AccessGate
        userAccess={sessionUser.role?.customers}
        requiredPermissions={32}
      >
        {allCustomers.map(x => (
          <Group key={x.CustomerID}>
            <span>{x.CustomerID} </span>
            <span>{x.OrganizationName} </span>
            <span>{x.Telephone1} </span>
          </Group>
        ))}
      </AccessGate>
      
    </>
  )
}
