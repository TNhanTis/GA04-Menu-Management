import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. File upload will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const SUPABASE_BUCKET = 'menu-photos';
