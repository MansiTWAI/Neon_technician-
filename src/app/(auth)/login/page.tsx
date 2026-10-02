import type { Metadata } from 'next';
import { PhoneSignIn } from '@/components/auth/phone-sign-in';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  // Only same-site paths: "//host" and "/\host" would send the user to another site after signing in.
  const destination = next && /^\/(?![/\\])/.test(next) ? next : '/';

  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-12">
      <p className="font-display text-lg font-bold tracking-wide">
        <span className="text-brand">NEON</span> ADDA
      </p>
      <h1 className="mt-6 font-display text-2xl font-bold text-gray-900">Technician sign-in</h1>
      <p className="mt-1 text-sm text-gray-500">Use the mobile number your franchise registered for you.</p>
      <div className="mt-8">
        <PhoneSignIn next={destination} />
      </div>
    </main>
  );
}
