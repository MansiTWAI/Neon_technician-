import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { JobAlertsRow } from '@/components/job-alerts-row';
import { SignOutButton } from '@/components/sign-out-button';
import { serverApi } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const profile = await serverApi.profile();
  if (!profile) redirect('/login');

  const rows = [
    ['Name', profile.technician?.name ?? profile.name],
    ['Franchise', profile.technician?.franchise ?? 'Neon Adda'],
  ];

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-gray-900">Profile</h1>

      <dl className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-200">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-gray-500">{label}</dt>
            <dd className="font-medium text-gray-900">{value}</dd>
          </div>
        ))}
        <JobAlertsRow />
      </dl>

      <div className="mt-6">
        <SignOutButton />
      </div>
    </>
  );
}
