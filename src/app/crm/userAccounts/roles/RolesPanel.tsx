import { listRoles } from "./actions";
import { RolesTable } from "./RolesTable";
import { Suspense } from "react";
import { Alert, Center, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export async function RolesPanel() {
  const response = await listRoles();

  return (
    <Suspense fallback={
      <Center h={200}>
        <Loader />
      </Center>
    }>
      {response.success ? (
        <RolesTable rolesData={response.data} />
      ) : (
        <Alert color="red" icon={<IconAlertCircle />}>
          {response.error}
        </Alert>
      )}
    </Suspense>
  )
}
