import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://bfxroxboykuivgckmebw.supabase.co';
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);
export const SITE = 'propertymanagementgibraltar.com';
