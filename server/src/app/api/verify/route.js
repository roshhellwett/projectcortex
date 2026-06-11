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

    // 1. Check Server Time against Expiry
    if (new Date() > new Date(payload.expiresAt)) {
      // Opportunistically mark as expired in DB (non-blocking)
      supabase.from('licenses').update({ status: 'expired' }).eq('id', payload.id).then();
      return NextResponse.json({ error: 'License has expired' }, { status: 403 });
    }

    // 2. Fetch the latest status from DB just in case it was manually revoked
    const { data: license } = await supabase
      .from('licenses')
      .select('status')
      .eq('id', payload.id)
      .single();

    if (!license || license.status === 'revoked') {
      return NextResponse.json({ error: 'License has been revoked' }, { status: 403 });
    }

    // Token is valid and server time checks out.
    return NextResponse.json({ success: true, expiresAt: payload.expiresAt, seed: payload.seed });

  } catch (error) {
    console.error('Verify Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
