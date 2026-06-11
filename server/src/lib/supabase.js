import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';

if (supabaseUrl === 'https://dummy.supabase.co' || supabaseServiceKey === 'dummy_key') {
  console.warn('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
