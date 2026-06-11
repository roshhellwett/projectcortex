import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { signActivationToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { licenseKey, installId } = await req.json();

    if (!licenseKey || !installId) {
      return NextResponse.json({ error: 'Missing licenseKey or installId' }, { status: 400 });
    }

    // 1. Find the license
    const { data: license, error: fetchError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (fetchError || !license) {
      return NextResponse.json({ error: 'Invalid license key' }, { status: 403 });
    }

    if (license.status === 'revoked') {
      return NextResponse.json({ error: 'License key has been revoked' }, { status: 403 });
    }

    // 2. If already active
    if (license.status === 'active') {
      if (license.install_id !== installId) {
        return NextResponse.json({ error: 'License key is already used on another device' }, { status: 403 });
      }

      // Check if expired
      if (new Date() > new Date(license.expires_at)) {
        // Automatically mark as expired
        await supabase.from('licenses').update({ status: 'expired' }).eq('id', license.id);
        return NextResponse.json({ error: 'License key has expired' }, { status: 403 });
      }

      // Re-issue token for the same device
      const token = signActivationToken({
        id: license.id,
        licenseKey: license.license_key,
        installId: license.install_id,
        expiresAt: license.expires_at,
        seed: process.env.AI_CRYPTO_SEED || 'default_seed_777' // Crypto seed for UI anti-tamper
      });

      return NextResponse.json({ success: true, token, expiresAt: license.expires_at });
    }

    // 3. If unused, activate it
    if (license.status === 'unused') {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

      const { error: updateError } = await supabase
        .from('licenses')
        .update({
          status: 'active',
          install_id: installId,
          activated_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq('id', license.id);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: 'Failed to activate license' }, { status: 500 });
      }

      const token = signActivationToken({
        id: license.id,
        licenseKey: license.license_key,
        installId: installId,
        expiresAt: expiresAt.toISOString(),
        seed: process.env.AI_CRYPTO_SEED || 'default_seed_777'
      });

      return NextResponse.json({ success: true, token, expiresAt: expiresAt.toISOString() });
    }

    return NextResponse.json({ error: 'License is not valid for activation' }, { status: 403 });

  } catch (error) {
    console.error('Activation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
