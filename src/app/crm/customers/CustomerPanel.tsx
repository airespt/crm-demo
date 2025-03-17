import { Suspense } from "react";
import { CustomerTable } from "./CustomerTable";
import { listCustomers } from "./actions";
import { Alert, Center, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export async function CustomerPanel() {
  const response = await listCustomers()

  return (
    <Suspense fallback={
      <Center h={200}>
        <Loader />
      </Center>
    }>
      {response.success ? (
        <CustomerTable rowData={response.data} />
      ) : (
        <Alert color="red" icon={<IconAlertCircle />}>
          {response.error}
        </Alert>
      )}
    </Suspense>
  )
}
