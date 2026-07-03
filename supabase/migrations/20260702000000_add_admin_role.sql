-- Add is_admin column to profiles table (safe – does nothing if already exists)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Mark the demo/admin account as admin by their email
-- (runs via auth.users join so we use a DO block)
DO $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid
  FROM auth.users
  WHERE email = 'kiruthick3238q@gmail.com'
  LIMIT 1;

  IF v_uid IS NOT NULL THEN
    -- Upsert into profiles so the row exists
    INSERT INTO profiles (id, is_admin)
    VALUES (v_uid, true)
    ON CONFLICT (id) DO UPDATE SET is_admin = true;
  END IF;
END $$;
