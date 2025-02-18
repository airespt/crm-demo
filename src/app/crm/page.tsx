import { useSession } from '@/app/login/actions';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Title } from '@mantine/core';
import { CrmContent } from './crmContent';
//import { ValidateLoggedUser } from '@/components/nav/ValidateLoggedUser';

export default async function CrmPage() {
  const user = await useSession('/crm');
  console.log(JSON.stringify(user));
  return (
    <>
      {/* <ValidateLoggedUser /> */}
      <Title>Welcome CRM</Title>
      <CrmContent />
      <ColorSchemeToggle />
    </>
  );
}
