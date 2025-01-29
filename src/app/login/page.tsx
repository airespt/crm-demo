//import LoginForm from '@/app/ui/login-form';
import { getAllUsers } from '@/Repos/users';
import Image from 'next/image';
import { LoginPanel } from './LoginPanel';
 
export default async function LoginPage() {
  const allUsers = await getAllUsers();

  return (
    <main className="flex items-center justify-center md:h-screen">
      <Image src={'/favicon.png'} alt='logo' width={100} height={100}/>
      {JSON.stringify(allUsers)}
      <LoginPanel />
    </main>
  );
}
