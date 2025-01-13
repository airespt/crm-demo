import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { UserTable, UserTableProps } from './UserTable';
import { Container } from '@mantine/core';

import { data } from "./mockData";

const tableRows = data
const tableHeaders = [
  { field: 'name', flex: 1, },
  { field: 'email', flex: 1 , filter: "agTextColumnFilter"},
  { field: 'company', flex: 1  }
] as UserTableProps["headers"]

export default function Page() {

  return (
    <>
      Users page
      <Container size="90vw" h="90vh">
        <UserTable rowData={data} headers={tableHeaders}/>
      </Container>
    </>
  );
}
