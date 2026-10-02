import { redirect } from 'next/navigation';
import { TabBar } from '@/components/tab-bar';
import { serverApi } from '@/lib/server-api';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!(await serverApi.profile())) redirect('/login');

  return (
    <>
      <main className="flex-1 px-4 pt-6 pb-24">{children}</main>
      <TabBar />
    </>
  );
}
