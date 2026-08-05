const FOREST_SUPABASE_URL = 'https://jacvltitwrxyfoasjcwq.supabase.co';
const FOREST_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_rzPK7YDpZxKJgBeJ64Z2qw_4uH1qbfW';

window.forestSupabase = window.supabase.createClient(
  FOREST_SUPABASE_URL,
  FOREST_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
