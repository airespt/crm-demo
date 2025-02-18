import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React, { StrictMode } from 'react';
import { ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { UserContextProvider } from '@/contexts/UserContext';

import { theme } from '../theme';

import '@mantine/core/styles.css';
import './globals.css';

export const metadata = {
  title: 'crm Demo',
  description: 'crm WIP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-pt" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <StrictMode>
          <MantineProvider theme={theme}>
            <Notifications />
            <UserContextProvider>
              {children}
            </UserContextProvider>
          </MantineProvider>
        </StrictMode>
      </body>
    </html>
  );
}
