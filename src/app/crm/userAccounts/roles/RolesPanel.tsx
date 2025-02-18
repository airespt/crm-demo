import { listRoles } from "./actions";
import { RolesTable } from "./RolesTable";
import { Suspense } from "react";
import { Alert, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export async function RolesPanel() {
  const response = await listRoles();

  return (
    <Suspense fallback={<Loader />}>
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
