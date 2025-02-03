import '@mantine/core/styles.css';

import React from 'react';
import { AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Group,
  NavLink
} from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'crm Demo',
  description: 'crm WIP',
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 160,
        breakpoint: 'xs',
      }}
    >
      <AppShellHeader>
        <Group p={10}>
          <Image src={'/favicon.png'} alt='logo' width={40} height={40}/>
          
        </Group>
      </AppShellHeader>
      <AppShellNavbar>
        <NavLink label="Home" href="/crm" component={Link} />
        <NavLink label="Clientes" href="/crm/customers" component={Link} />
        <NavLink label="Users" href="/crm/users" component={Link}>
          <NavLink label="Permissions" href="/crm/users/roles" component={Link} />
        </NavLink>
      </AppShellNavbar>
      <AppShellMain>
        {children}
      </AppShellMain>
    </AppShell>
  );
}
