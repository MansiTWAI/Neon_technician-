import { History } from 'lucide-react';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { JobCard } from '@/components/job-card';
import type { JobSummary } from '@/lib/jobs';
import { serverApi } from '@/lib/server-api';

export const metadata: Metadata = { title: 'History' };

export default async function HistoryPage() {
  const jobs = await serverApi.request<JobSummary[]>('/field/jobs?scope=history');

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-gray-900">History</h1>
      <div className="mt-6 space-y-3">
        {jobs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No finished jobs"
            body="Finished installations are kept here with their photos."
          />
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </>
  );
}
