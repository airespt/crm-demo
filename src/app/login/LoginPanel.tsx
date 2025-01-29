'use client'

import { signIn } from "@/actions/users/auth";
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  TextInput
} from "@mantine/core";
import { useActionState } from "react";

export function LoginPanel() {
  const [state, action, pending] = useActionState(signIn, undefined)
 
  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <form action={action}>
        <TextInput
          name="email"
          label="Email"
          placeholder="you@inforomba.pt"
          defaultValue={String(state?.email || "")}
          error={state?.errors?.email}
          required
        />
        <PasswordInput
          mt="md"
          name="password"
          label="Password"
          placeholder="Your password"
          defaultValue={String(state?.password || "")}
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