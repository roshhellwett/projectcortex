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

  const { action, id, count } = await req.json();

  if (action === 'generate') {
    const newLicenses = [];
    for (let i = 0; i < (count || 5); i++) {
      newLicenses.push({
        license_key: 'CORTEX-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        status: 'unused'
      });
    }
    const { error } = await supabase.from('licenses').insert(newLicenses);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'revoke') {
    const { error } = await supabase.from('licenses').update({ status: 'revoked' }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
