'use client';

import {
  ModuleRegistry,
  ClientSideRowModelModule,
  AllCommunityModule,
} from 'ag-grid-community';

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
])

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /* Put your mantine theme override here */
});
