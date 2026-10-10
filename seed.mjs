import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing env vars for Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding editorial insights...");

  // Insert into posts
  const { data, error } = await supabase.from("posts").insert([
    {
      author_id: "00000000-0000-0000-0000-000000000000", // Will probably fail RLS, let's just insert as service role if we have it? 
      // Wait, we don't have the service_role key in VITE_SUPABASE_ANON_KEY
      content: "The Meaning Behind the Ritual: Lighting the Diya. In many traditions, lighting a lamp signifies the dispelling of ignorance.",
      topic: "Rituals",
      type: "article",
      status: "published",
      tradition: "Sanatana Dharma",
      media_url: "https://images.unsplash.com/photo-1572004812328-98e3cc582bf2"
    },
    {
      author_id: "00000000-0000-0000-0000-000000000000",
      content: "A Word That Holds a World: 'Ubuntu'. It translates to 'I am because we are', reflecting a deep African philosophy of interconnectedness.",
      topic: "Philosophy",
      type: "article",
      status: "published",
      tradition: "African Diaspora",
      media_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
    }
  ]);

  if (error) {
    console.error("Error seeding:", error);
  } else {
    console.log("Seeded successfully:", data);
  }
}

seed();
