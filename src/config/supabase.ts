import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a scoped client using the user's JWT (for RLS enforcement)
export const createUserClient = (token: string) => {
  return createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
};
