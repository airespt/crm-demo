import { hasPermission } from "@/actions/auth/userPermissions"
import { Center, Stack, Title } from "@mantine/core"
import { ReactNode } from "react"

type AccessGateProps = {
  userAccess?: number,
  requiredPermissions: number,
  children: ReactNode
}

export function AccessGate({ userAccess, requiredPermissions, children }: AccessGateProps) {
  const hasAccess = hasPermission(userAccess, requiredPermissions)

  return hasAccess ? children : (
      <Center mt="xl">
        <Stack align="center" gap={3}>
          <Title>Unauthorized</Title>
          No permissions to view this page
        </Stack>
      </Center>
    )
}