import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to check password
function isAuthorized(req) {
  const authHeader = req.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return authHeader === `Bearer ${adminPassword}`;
}

export async function GET(req) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('licenses').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ licenses: data });
}

export async function POST(req) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, id, count, days } = await req.json();

  if (action === 'generate') {
    // Server-side validation: clamp count between 1-100
    const safeCount = Math.min(Math.max(parseInt(count) || 5, 1), 100);
    const newLicenses = [];
    for (let i = 0; i < safeCount; i++) {
      newLicenses.push({
        license_key: 'CORTEX-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        status: 'unused'
      });
    }
    const { error } = await supabase.from('licenses').insert(newLicenses);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, count: safeCount });
  }

  if (action === 'revoke') {
    if (!id) return NextResponse.json({ error: 'Missing license id' }, { status: 400 });
    const { error } = await supabase.from('licenses').update({ status: 'revoked' }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'delete') {
    if (!id) return NextResponse.json({ error: 'Missing license id' }, { status: 400 });
    // Safety: only allow deleting unused keys
    const { data: lic } = await supabase.from('licenses').select('status').eq('id', id).single();
    if (!lic) return NextResponse.json({ error: 'License not found' }, { status: 404 });
    if (lic.status !== 'unused') {
      return NextResponse.json({ error: 'Only unused keys can be deleted. Revoke active keys instead.' }, { status: 400 });
    }
    const { error } = await supabase.from('licenses').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'extend') {
    if (!id) return NextResponse.json({ error: 'Missing license id' }, { status: 400 });
    const safeDays = Math.min(Math.max(parseInt(days) || 7, 1), 365);
    const { data: lic } = await supabase.from('licenses').select('expires_at, status').eq('id', id).single();
    if (!lic) return NextResponse.json({ error: 'License not found' }, { status: 404 });
    if (lic.status === 'revoked') {
      return NextResponse.json({ error: 'Cannot extend a revoked license' }, { status: 400 });
    }
    // Extend from current expiry or from now if expired/unused
    const base = (lic.expires_at && new Date(lic.expires_at) > new Date()) 
      ? new Date(lic.expires_at) 
      : new Date();
    const newExpiry = new Date(base.getTime() + safeDays * 24 * 60 * 60 * 1000);
    const updateData = { expires_at: newExpiry.toISOString() };
    // If expired, reactivate it
    if (lic.status === 'expired') updateData.status = 'active';
    const { error } = await supabase.from('licenses').update(updateData).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, newExpiry: newExpiry.toISOString() });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
