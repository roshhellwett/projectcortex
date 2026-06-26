// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { signActivationToken } from '@/lib/auth';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(req) {
  try {
    const { installId } = await req.json();

    if (!installId) {
      return NextResponse.json({ error: 'Missing installId' }, { status: 400 });
    }

    const { data: licenses, error: fetchError } = await supabase
      .from('licenses')
      .select('id, license_key, status, install_id, activated_at, expires_at, duration_days')
      .eq('install_id', installId)
      .limit(1);

    if (fetchError || !licenses || licenses.length === 0) {
      return NextResponse.json({ error: 'No license found for this device. Please activate with a key.' }, { status: 404 });
    }

    const license = licenses[0];

    if (license.status === 'revoked') {
      return NextResponse.json({ error: 'License associated with this device has been revoked.' }, { status: 403 });
    }

    if (license.expires_at && new Date() > new Date(license.expires_at)) {
      if (license.status !== 'expired') {
        await supabase.from('licenses').update({ status: 'expired' }).eq('id', license.id);
      }
      return NextResponse.json({
        error: 'License has expired.',
        code: 'LICENSE_EXPIRED',
        expiresAt: license.expires_at,
        licenseKey: license.license_key
      }, { status: 410 });
    }

    if (license.status === 'expired') {
      return NextResponse.json({
        error: 'License has expired.',
        code: 'LICENSE_EXPIRED',
        expiresAt: license.expires_at,
        licenseKey: license.license_key
      }, { status: 410 });
    }

    const token = signActivationToken({
      id: license.id,
      licenseKey: license.license_key,
      installId: license.install_id,
      expiresAt: license.expires_at,
      seed: process.env.AI_CRYPTO_SEED || 'default_seed_777'
    });

    const remainingMs = license.expires_at ? new Date(license.expires_at).getTime() - Date.now() : 0;

    return NextResponse.json({
      success: true,
      token,
      expiresAt: license.expires_at,
      activatedAt: license.activated_at,
      licenseKey: license.license_key,
      status: license.status,
      daysRemaining: Math.max(0, Math.ceil(remainingMs / DAY_MS))
    });

  } catch (error) {
    console.error('Reactivate Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
