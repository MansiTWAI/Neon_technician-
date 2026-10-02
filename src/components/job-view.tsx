'use client';

import { formatINR } from '@neon-adda/shared';
import { ApiError } from '@neon-adda/shared/web/client';
import { Camera, Check, ChevronLeft, LoaderCircle, MapPin, Navigation, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { api } from '@/lib/browser-api';
import {
  addressLine,
  dateTimeLabel,
  directionsUrl,
  NEXT_STEP,
  PROGRESS,
  STATUS_LABEL,
  STATUS_TONE,
  timeLabel,
  type JobDetail,
  type PhotoStage,
} from '@/lib/jobs';
import { CodeInput, Field, FormError, SubmitButton } from './ui/form';

const STAGES: { stage: PhotoStage; label: string; hint: string }[] = [
  { stage: 'BEFORE', label: 'Before', hint: 'The bare wall and where the sign will go.' },
  { stage: 'DURING', label: 'During', hint: 'Mounting and wiring.' },
  { stage: 'AFTER', label: 'After', hint: 'The finished sign, switched on.' },
];

const IN_PROGRESS = ['ACCEPTED', 'ON_THE_WAY', 'REACHED', 'WORK_STARTED'];

export function JobView({ initial }: { initial: JobDetail }) {
  const [job, setJob] = useState(initial);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(key: string, path: string, init: RequestInit) {
    setPending(key);
    setError(null);
    try {
      setJob(await api.request<JobDetail>(path, init));
      return true;
    } catch (err) {
      setError(
        err instanceof ApiError ? err.title : 'Something went wrong. Check your connection and try again.',
      );
      return false;
    } finally {
      setPending(null);
    }
  }

  const next = NEXT_STEP[job.status];
  const step = PROGRESS.indexOf(job.status);
  const open = !['COMPLETED', 'FAILED', 'CANCELLED'].includes(job.status);

  return (
    <div className="space-y-5">
      <div>
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500">
          <ChevronLeft className="size-4" /> Jobs
        </Link>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">{job.customer.name}</h1>
            <p className="text-sm text-gray-500">Order {job.orderNo}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[job.status]}`}>
            {STATUS_LABEL[job.status]}
          </span>
        </div>
        {job.scheduledStart && (
          <p className="mt-2 text-sm text-gray-700">
            {dateTimeLabel.format(new Date(job.scheduledStart))}
            {job.scheduledEnd && ` to ${timeLabel.format(new Date(job.scheduledEnd))}`}
          </p>
        )}
      </div>

      {open && (
        <ol className="grid grid-cols-5 gap-1" aria-label="Progress">
          {PROGRESS.map((status, i) => (
            <li key={status} className="text-center">
              <span className={`block h-1.5 rounded-full ${i <= step ? 'bg-brand' : 'bg-gray-200'}`} />
              <span className="mt-1 block text-[10px] leading-tight text-gray-500">
                {STATUS_LABEL[status]}
              </span>
            </li>
          ))}
        </ol>
      )}

      <section className="rounded-2xl border border-gray-200 p-4">
        <p className="flex gap-2 text-sm text-gray-700">
          <MapPin className="mt-0.5 size-4 shrink-0 text-gray-400" />
          {addressLine(job.address)}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={`tel:${job.customer.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-900"
          >
            <Phone className="size-4" /> Call
          </a>
          <a
            href={directionsUrl(job.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-900"
          >
            <Navigation className="size-4" /> Directions
          </a>
        </div>
      </section>

      <FormError message={error} />

      {next && (
        <button
          onClick={() =>
            run('step', `/field/jobs/${job.id}/status`, {
              method: 'POST',
              body: JSON.stringify({ to: next.to }),
            })
          }
          disabled={pending !== null}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-white disabled:opacity-60"
        >
          {pending === 'step' && <LoaderCircle className="size-4 animate-spin" />}
          {next.action}
        </button>
      )}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{job.items.length === 1 ? 'Sign' : 'Signs'}</h2>
        <ul className="mt-2 space-y-3">
          {job.items.map((item) => (
            <li key={item.id} className="flex gap-3 rounded-2xl border border-gray-200 p-3">
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt=""
                  className="size-20 shrink-0 rounded-lg bg-gray-900 object-contain"
                />
              ) : (
                <span className="size-20 shrink-0 rounded-lg bg-gray-900" />
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">{item.description}</p>
                <p className="mt-1 text-gray-500">
                  {item.widthIn}″ × {item.heightIn}″ · Qty {item.qty}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {job.notes && (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm whitespace-pre-line text-amber-900">
            {job.notes}
          </p>
        )}
      </section>

      {job.payment.duePaise > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Collect {formatINR(job.payment.duePaise)}</p>
          <p className="mt-0.5">
            {job.payment.mode === 'COD'
              ? 'Cash on delivery. Collect it in cash or by UPI to the company account before you leave.'
              : 'Balance due on this order.'}
          </p>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">Photos</h2>
        <div className="mt-2 space-y-4">
          {STAGES.map(({ stage, label, hint }) => (
            <PhotoStageRow
              key={stage}
              label={label}
              hint={hint}
              photos={job.photos.filter((p) => p.stage === stage)}
              canAdd={IN_PROGRESS.includes(job.status)}
              pending={pending === stage}
              onAdd={(file) => {
                const body = new FormData();
                body.append('file', file);
                return run(stage, `/field/jobs/${job.id}/photos?stage=${stage}`, { method: 'POST', body });
              }}
            />
          ))}
        </div>
      </section>

      {job.status === 'WORK_STARTED' && (
        <CompleteForm
          job={job}
          pending={pending === 'complete'}
          onSubmit={(body) =>
            run('complete', `/field/jobs/${job.id}/complete`, { method: 'POST', body: JSON.stringify(body) })
          }
        />
      )}

      {IN_PROGRESS.includes(job.status) && (
        <ReportProblem
          pending={pending === 'fail'}
          onSubmit={(reason) =>
            run('fail', `/field/jobs/${job.id}/fail`, { method: 'POST', body: JSON.stringify({ reason }) })
          }
        />
      )}

      {job.status === 'COMPLETED' && job.completedAt && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          <Check className="size-4" /> Completed {dateTimeLabel.format(new Date(job.completedAt))}
        </p>
      )}
      {job.status === 'FAILED' && job.failReason && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">Not completed: {job.failReason}</p>
      )}
    </div>
  );
}

function PhotoStageRow(props: {
  label: string;
  hint: string;
  photos: JobDetail['photos'];
  canAdd: boolean;
  pending: boolean;
  onAdd: (file: File) => Promise<boolean>;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-sm font-medium text-gray-700">{props.label}</p>
      <p className="text-xs text-gray-500">{props.hint}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {props.photos.map((photo) => (
          <a key={photo.id} href={photo.url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="size-20 rounded-lg object-cover" />
          </a>
        ))}
        {props.canAdd && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={props.pending}
            className="grid size-20 place-items-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500"
            aria-label={`Add a ${props.label.toLowerCase()} photo`}
          >
            {props.pending ? <LoaderCircle className="size-5 animate-spin" /> : <Camera className="size-5" />}
          </button>
        )}
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) await props.onAdd(file);
          }}
        />
      </div>
    </div>
  );
}

function CompleteForm(props: {
  job: JobDetail;
  pending: boolean;
  onSubmit: (body: { code: string; collected: string; notes?: string }) => Promise<boolean>;
}) {
  const due = props.job.payment.duePaise;
  const hasAfter = props.job.photos.some((p) => p.stage === 'AFTER');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void props.onSubmit({
      code: String(form.get('code') ?? ''),
      collected: String(form.get('collected') ?? 'NONE'),
      notes: String(form.get('notes') ?? '') || undefined,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-200 p-4">
      <div>
        <h2 className="font-semibold text-gray-900">Finish the installation</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Show the customer the lit sign. Their order page has a 6-digit code: ask them to read it out.
        </p>
      </div>
      {!hasAfter && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Add an after photo first.</p>
      )}
      <Field label="Customer’s code">
        <CodeInput name="code" required />
      </Field>
      {due > 0 && (
        <fieldset className="space-y-2 text-sm">
          <legend className="font-medium text-gray-700">{formatINR(due)} due</legend>
          {[
            ['CASH', 'Collected in cash'],
            ['UPI', 'Paid by UPI to the company account'],
            ['NONE', 'Not collected'],
          ].map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input type="radio" name="collected" value={value} defaultChecked={value === 'CASH'} />
              {label}
            </label>
          ))}
        </fieldset>
      )}
      <Field label="Notes (optional)">
        <textarea
          name="notes"
          rows={2}
          maxLength={1000}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>
      <SubmitButton pending={props.pending}>Complete installation</SubmitButton>
    </form>
  );
}

function ReportProblem({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (reason: string) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full py-2 text-sm font-medium text-red-600">
        Cannot complete this visit
      </button>
    );
  }
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const reason = String(new FormData(event.currentTarget).get('reason') ?? '');
        if (await onSubmit(reason)) setOpen(false);
      }}
      className="space-y-3 rounded-2xl border border-red-200 p-4"
    >
      <Field label="What stopped the installation?">
        <textarea
          name="reason"
          rows={3}
          required
          minLength={5}
          maxLength={500}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>
      <SubmitButton pending={pending}>Report and close the visit</SubmitButton>
    </form>
  );
}
