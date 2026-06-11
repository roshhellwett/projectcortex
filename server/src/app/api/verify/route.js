import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyActivationToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const payload = verifyActivationToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or malformed token' }, { status: 403 });
    }

    // 1. Fetch the latest status and expiry from DB to ensure we have live data
    // This is critical because admins can extend licenses, which changes the DB but not the client's old JWT.
    const { data: license } = await supabase
      .from('licenses')
      .select('status, expires_at, license_key')
      .eq('id', payload.id)
      .single();

    if (!license || license.status === 'revoked') {
      return NextResponse.json({ error: 'License has been revoked' }, { status: 403 });
    }

    // 2. Check Server Time against the LIVE DB Expiry
    if (new Date() > new Date(license.expires_at)) {
      if (license.status !== 'expired') {
        supabase.from('licenses').update({ status: 'expired' }).eq('id', payload.id).then();
      }
      return NextResponse.json({ error: 'License has expired' }, { status: 403 });
    }

    // 3. Issue a fresh token with the potentially updated DB expiry
    // We import generateActivationToken dynamically or we can just require it if we import it at top.
    const jwt = require('jsonwebtoken');
    const freshToken = jwt.sign(
      { id: payload.id, seed: payload.seed, expiresAt: license.expires_at },
      process.env.JWT_SECRET || 'fallback_secret_only_for_dev_cortex_2026'
    );

    // Token is valid and server time checks out.
    return NextResponse.json({ success: true, expiresAt: license.expires_at, seed: payload.seed, token: freshToken });

  } catch (error) {
    console.error('Verify Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
