import React from 'react';
import { Anchor, AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Group,
  NavLink
} from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { NavLinkLogout } from '@/components/nav/NavLinkLogout';


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
        <NavLink label="Users">
          <NavLink label="Accounts" href="/crm/userAccounts/users" component={Link} />
          <NavLink label="Permissions" href="/crm/userAccounts/roles" component={Link} />
        </NavLink>
        <NavLinkLogout />
      </AppShellNavbar>
      <AppShellMain>
        {children}
      </AppShellMain>
    </AppShell>
  );
}
