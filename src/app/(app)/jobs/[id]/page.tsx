import { ApiError } from '@neon-adda/shared/web/client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JobView } from '@/components/job-view';
import type { JobDetail } from '@/lib/jobs';
import { serverApi } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Job' };

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const job = await serverApi.request<JobDetail>(`/field/jobs/${id}`);
    return <JobView initial={job} />;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
}
