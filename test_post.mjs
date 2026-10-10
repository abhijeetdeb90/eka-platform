import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.log("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: user, error: userError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com', // Need a test user? Maybe I'll just check if we can insert without auth and it'll fail. Or check RLS.
    password: 'password'
  });
  console.log(user, userError);
}

test();
