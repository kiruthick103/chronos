const { execSync } = require('child_process');

// Replace these with your active Supabase project credentials if changed
const url = (process.env.NEW_SUPABASE_URL || "https://xsnvdqtborxtppaxdett.supabase.co").trim();
const key = (process.env.NEW_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbnZkcXRib3J4dHBwYXhkZXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDI4MzIsImV4cCI6MjA5Nzg3ODgzMn0.p55u2zz81wrquRd85gAio-TBMSw6DZFynWBNA6Fcrco").trim();
const apiUrl = (process.env.NEW_API_URL || "https://chronos-backend-aloneforrender.onrender.com").trim();

const envs = {
  "VITE_SUPABASE_URL": url,
  "VITE_SUPABASE_ANON_KEY": key,
  "VITE_API_URL": apiUrl
};

for (const [name, value] of Object.entries(envs)) {
  console.log(`Removing ${name}...`);
  try {
    execSync(`npx vercel env rm ${name} production --yes`, { stdio: 'inherit' });
  } catch (e) {
    console.log(`Could not remove ${name} or it didn't exist.`);
  }
  
  console.log(`Adding clean ${name}...`);
  try {
    execSync(`npx vercel env add ${name} production`, { input: Buffer.from(value.trim()) });
  } catch (e) {
    console.log(`Failed to add ${name}: ${e.message}`);
  }
}

console.log("Done updating environment variables.");

