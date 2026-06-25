// Copyright (c) 2026 Zenith Open Source Projects
// SPDX-License-Identifier: MIT

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('id', 'latest_version')
      .single();

    if (error || !data) {
      // Fallback version if not set
      return NextResponse.json({ version: '10.0.0' }, { status: 200 });
    }

    return NextResponse.json({ version: data.value }, { status: 200 });
  } catch (error) {
    console.error('Version API Error:', error);
    return NextResponse.json({ version: '10.0.0' }, { status: 200 });
  }
}
