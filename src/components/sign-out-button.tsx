'use client';

import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/browser-api';

export function SignOutButton() {
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await api.signOut();
    // A full load, so nothing rendered for the previous session survives in the router cache.
    window.location.replace('/login');
  }

  return (
    <button
      onClick={signOut}
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
    >
      <LogOut className="size-4" /> Sign out
    </button>
  );
}
