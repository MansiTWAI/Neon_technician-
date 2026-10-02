export type JobStatus =
  | 'UNASSIGNED'
  | 'SCHEDULED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'REACHED'
  | 'WORK_STARTED'
  | 'COMPLETED'
  | 'RESCHEDULED'
  | 'FAILED'
  | 'CANCELLED';

export type PhotoStage = 'BEFORE' | 'DURING' | 'AFTER';

export interface JobSummary {
  id: string;
  status: JobStatus;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  completedAt: string | null;
  orderNo: string;
  orderStatus: string;
  customerName: string;
  address: { line1: string; line2: string | null; landmark: string | null; city: string; pincode: string };
  signs: number;
  duePaise: number;
}

export interface JobDetail extends JobSummary {
  notes: string | null;
  failReason: string | null;
  customer: { name: string; phone: string };
  items: {
    id: string;
    description: string;
    widthIn: number;
    heightIn: number;
    qty: number;
    previewUrl: string | null;
  }[];
  photos: { id: string; stage: PhotoStage; url: string; at: string }[];
  payment: { mode: 'FULL' | 'ADVANCE' | 'COD'; totalPaise: number; duePaise: number };
}

export const STATUS_LABEL: Record<JobStatus, string> = {
  UNASSIGNED: 'Not assigned',
  SCHEDULED: 'New',
  RESCHEDULED: 'Rescheduled',
  ACCEPTED: 'Accepted',
  ON_THE_WAY: 'On the way',
  REACHED: 'Reached',
  WORK_STARTED: 'Work started',
  COMPLETED: 'Completed',
  FAILED: 'Not completed',
  CANCELLED: 'Cancelled',
};

export const STATUS_TONE: Record<JobStatus, string> = {
  UNASSIGNED: 'bg-gray-100 text-gray-600',
  SCHEDULED: 'bg-brand-soft text-brand',
  RESCHEDULED: 'bg-amber-50 text-amber-700',
  ACCEPTED: 'bg-sky-50 text-sky-700',
  ON_THE_WAY: 'bg-sky-50 text-sky-700',
  REACHED: 'bg-sky-50 text-sky-700',
  WORK_STARTED: 'bg-violet-50 text-violet-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  FAILED: 'bg-red-50 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

/** The next step the technician takes from each status, with the button that takes it. */
export const NEXT_STEP: Partial<Record<JobStatus, { to: JobStatus; action: string }>> = {
  SCHEDULED: { to: 'ACCEPTED', action: 'Accept visit' },
  RESCHEDULED: { to: 'ACCEPTED', action: 'Accept new time' },
  ACCEPTED: { to: 'ON_THE_WAY', action: 'Set out' },
  ON_THE_WAY: { to: 'REACHED', action: 'I have reached' },
  REACHED: { to: 'WORK_STARTED', action: 'Start work' },
};

/** Steps shown as progress on a visit, in order. */
export const PROGRESS: JobStatus[] = ['ACCEPTED', 'ON_THE_WAY', 'REACHED', 'WORK_STARTED', 'COMPLETED'];

const ist = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-IN', { ...options, timeZone: 'Asia/Kolkata' });

export const dayLabel = ist({ weekday: 'long', day: 'numeric', month: 'long' });
export const timeLabel = ist({ hour: 'numeric', minute: '2-digit' });
export const dateTimeLabel = ist({ day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export const addressLine = (address: JobSummary['address']) =>
  [address.line1, address.line2, address.landmark, address.city, address.pincode].filter(Boolean).join(', ');

export const directionsUrl = (address: JobSummary['address']) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine(address))}`;
