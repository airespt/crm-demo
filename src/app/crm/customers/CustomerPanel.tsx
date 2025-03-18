import { Suspense } from "react";
import { CustomerTable } from "./CustomerTable";
import { listCustomers } from "./actions";
import { Alert, Center, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { VistasContextProvider } from "@/contexts/Vistas/VistasContext";
import { vistaConfig } from "./vistaConfig";

export async function CustomerPanel() {
  const response = await listCustomers()


  return (
    <Suspense fallback={
      <Center h={200}>
        <Loader />
      </Center>
    }>
      {response.success ? (
        <VistasContextProvider config={vistaConfig}>
          <CustomerTable rowData={response.data} />
        </VistasContextProvider>
      ) : (
        <Alert color="red" icon={<IconAlertCircle />}>
          {response.error}
        </Alert>
      )}
    </Suspense>
  )
}
