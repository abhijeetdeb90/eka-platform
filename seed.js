const supabaseUrl = "https://kbiutqzhcbyuseygcspe.supabase.co";
const supabaseKey = "sb_publishable_DKdNOtbppccL297o2_Ixkw_f2j0Rf7-";

async function seed() {
  // 1. Sign up a test user
  let token = null;
  let userId = null;
  
  console.log("Signing up...");
  const signupRes = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: { "apikey": supabaseKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "editorial@eka.app", password: "editorialpassword123" })
  });
  
  if (signupRes.ok) {
    const signupData = await signupRes.json();
    token = signupData.session?.access_token;
    userId = signupData.user?.id;
  } else {
    // try sign in
    console.log("Trying sign in...");
    const signinRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "apikey": supabaseKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: "editorial@eka.app", password: "editorialpassword123" })
    });
    if (signinRes.ok) {
      const signinData = await signinRes.json();
      token = signinData.access_token;
      userId = signinData.user?.id;
    } else {
      console.error("Auth failed", await signinRes.text());
      return;
    }
  }

  if (!token) {
    console.error("No token generated!");
    return;
  }
  
  console.log("Auth success. User ID:", userId);

  const data = [
    {
      author_id: userId,
      content: "The Meaning Behind the Ritual: Lighting the Diya. In many traditions, lighting a lamp signifies the dispelling of ignorance.",
      topic: "Rituals",
      type: "article",
      status: "published",
      tradition: "Sanatana Dharma",
      media_url: "https://images.unsplash.com/photo-1572004812328-98e3cc582bf2"
    },
    {
      author_id: userId,
      content: "A Word That Holds a World: 'Ubuntu'. It translates to 'I am because we are', reflecting a deep African philosophy of interconnectedness.",
      topic: "Philosophy",
      type: "article",
      status: "published",
      tradition: "African Diaspora",
      media_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
    }
  ];

  const res = await fetch(`${supabaseUrl}/rest/v1/posts`, {
    method: "POST",
    headers: {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error seeding posts:", res.status, errorText);
  } else {
    const result = await res.json();
    console.log("Seeded successfully:", result.length, "posts");
  }
}

seed();
