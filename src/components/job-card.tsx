import { ChevronRight, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { STATUS_LABEL, STATUS_TONE, timeLabel, type JobSummary } from '@/lib/jobs';

export function JobCard({ job }: { job: JobSummary }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-gray-300"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-semibold text-gray-900">{job.customerName}</span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[job.status]}`}
          >
            {STATUS_LABEL[job.status]}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-gray-500">
          {job.orderNo} · {job.signs === 1 ? '1 sign' : `${job.signs} signs`}
        </p>
        {job.scheduledStart && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="size-4 shrink-0" />
            {timeLabel.format(new Date(job.scheduledStart))}
            {job.scheduledEnd && ` to ${timeLabel.format(new Date(job.scheduledEnd))}`}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">
            {job.address.line1}, {job.address.city}
          </span>
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-gray-400" />
    </Link>
  );
}
