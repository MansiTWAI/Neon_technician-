import { CalendarCheck } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { JobCard } from '@/components/job-card';
import { dayLabel, type JobSummary } from '@/lib/jobs';
import { serverApi } from '@/lib/server-api';

export default async function JobsPage() {
  const jobs = await serverApi.request<JobSummary[]>('/field/jobs?scope=upcoming');

  const days = new Map<string, JobSummary[]>();
  for (const job of jobs) {
    const day = dayLabel.format(new Date(job.scheduledStart!));
    days.set(day, [...(days.get(day) ?? []), job]);
  }
  const today = dayLabel.format(new Date());

  return (
    <>
      <p className="text-sm text-gray-500">{today}</p>
      <h1 className="font-display text-2xl font-bold text-gray-900">Your jobs</h1>

      {jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={CalendarCheck}
            title="No jobs scheduled"
            body="When a visit is booked for you, it shows here with the address, contact and design to install."
          />
        </div>
      ) : (
        [...days].map(([day, dayJobs]) => (
          <section key={day} className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-500">{day === today ? 'Today' : day}</h2>
            <div className="space-y-3">
              {dayJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
