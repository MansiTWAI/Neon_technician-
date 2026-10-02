'use client';

import { enablePushNotifications, pushSupport, type PushOutcome } from '@neon-adda/shared/web/client';
import { BellRing } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/browser-api';
import { FIREBASE_CONFIG } from '@/lib/firebase';

type State = PushOutcome | 'available' | 'checking' | 'working' | 'failed';

const LABELS: Partial<Record<State, string>> = {
  enabled: 'On',
  denied: 'Blocked in browser settings',
  unsupported: 'Not supported on this phone',
  failed: 'Could not turn on',
};

/** A "Job alerts" row backed by Firebase Cloud Messaging. Renders nothing when Firebase is not configured. */
export function JobAlertsRow() {
  const [state, setState] = useState<State>('checking');

  useEffect(() => {
    void pushSupport(FIREBASE_CONFIG).then(setState);
  }, []);

  if (state === 'checking' || state === 'unconfigured') return null;

  async function enable() {
    setState('working');
    try {
      setState(
        await enablePushNotifications(FIREBASE_CONFIG, (token) =>
          api.request('/notifications/technician/devices', {
            method: 'POST',
            body: JSON.stringify({ token }),
          }),
        ),
      );
    } catch {
      setState('failed');
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <dt className="text-gray-500">Job alerts</dt>
      <dd>
        {state === 'available' || state === 'working' ? (
          <button
            onClick={enable}
            disabled={state === 'working'}
            className="inline-flex items-center gap-1.5 font-semibold text-brand disabled:opacity-60"
          >
            <BellRing className="size-4" /> Turn on
          </button>
        ) : (
          <span className="text-gray-700">{LABELS[state]}</span>
        )}
      </dd>
    </div>
  );
}
