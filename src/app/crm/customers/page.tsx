import { useSession } from '@/app/login/actions';
import { UserPermissions } from '@/app/login/userPermissions';
import { AccessGate } from '@/components/AccessGate';
import { CustomerPanel } from "./CustomerPanel";

export default async function Page() {
  const sessionUser = await useSession('/crm/customers');
  
  return (
    <>
      <AccessGate
        userAccess={sessionUser.role?.customers}
        requiredPermissions={UserPermissions.View}
      >
        <CustomerPanel />
      </AccessGate>
    </>
  )
}
