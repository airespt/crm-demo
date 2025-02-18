'use client'

import { signIn } from "@/app/login/actions";
import { useUserContext } from "@/contexts/UserContext";
import {
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  TextInput
} from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";

export function LoginPanel() {
  const [state, action, pending] = useActionState(signIn, undefined)
  
  const router = useRouter()
  const params = useSearchParams();
  const redirectTo = params?.get('redirect') || "/crm"

  const userContext = useUserContext()
  useEffect(() => {
    if( state?.user ) {
      userContext.login(state.user)
      router.replace(redirectTo)
    }
  }, [state?.user])

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      {JSON.stringify(state?.user)}
      <form action={action}>
        <TextInput
          name="email"
          label="Email"
          placeholder="you@inforomba.pt"
          defaultValue={state?.email as string}
          error={state?.errors?.email}
          required
        />
        <PasswordInput
          mt="md"
          name="password"
          label="Password"
          placeholder="Your password"
          defaultValue={state?.password as string}
          error={state?.errors?.password}
          required
        />
        {state?.message && <p>{state.message}</p>}
        <Group justify="space-between" mt="lg">
          {/* <Checkbox label="Remember me" /> */}
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button disabled={pending} type="submit" fullWidth mt="xl">
          Sign in
        </Button>
      </form>
    </Paper>
  )
}