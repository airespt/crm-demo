import { useSession } from '@/actions/auth/auth';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Title } from '@mantine/core';
import { usePathname } from 'next/navigation';

export default async function CrmPage() {
  await useSession('/crm');
  return (
    <>
      <Title>Welcome CRM</Title>
      <ColorSchemeToggle />
    </>
  );
}
