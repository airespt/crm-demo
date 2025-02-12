import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '@/components/Welcome/Welcome';
import { Button } from '@mantine/core';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <Button href='/login' component='a'>Login</Button>
      <ColorSchemeToggle />
    </>
  );
}
