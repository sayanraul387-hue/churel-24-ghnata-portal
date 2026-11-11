# Limited User Portal (6 accounts)

A responsive member portal with phone + password sign-in, a hard 6-account registration cap, member-only content, and an admin dashboard with successful-login history.

## Stack
- Vite + vanilla JavaScript
- Supabase Auth (phone/password)
- Supabase Postgres + Row Level Security

## 1. Create Supabase project
1. Visit https://supabase.com/ and create a project.
2. In **Project Settings → API**, copy the Project URL and the publishable/anon key.
3. In **Authentication → Providers → Phone**, enable Phone provider.
4. For the requested password-only flow, disable phone confirmation only if you accept that the number is not verified. If phone confirmation is enabled, users must complete the OTP step before they can sign in. The site does not send SMS itself.
5. Keep email/password settings as you prefer; this project uses phone/password.

> Important: a phone number entered by a user is not proof that they own it. If you need verified ownership, enable phone OTP and configure an SMS provider. Do not describe unverified numbers as verified.

## 2. Create database tables and security rules
1. Open **SQL Editor → New query** in Supabase.
2. Paste the complete contents of `supabase/schema.sql`.
3. Run it and confirm there are no errors.

The database trigger uses a transaction-scoped advisory lock and counts profiles before accepting each new auth user. The trigger aborts the Auth user creation if the 6 slots are full. Do not remove this trigger or rely only on a browser-side count.

## 3. Configure this project
1. Install Node.js (LTS).
2. In this folder, copy `.env.example` to `.env`.
3. Fill in your Supabase Project URL and publishable/anon key:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   ```
4. Install and run:
   ```
   npm install
   npm run dev
   ```
5. Open the local URL printed by Vite (usually http://localhost:5173).

Never put the Supabase `service_role` key in `.env`, frontend JavaScript, GitHub, or any browser-delivered file.

## 4. Make your account the admin
1. Register your own account first using your mobile number in international format (e.g. `+919876543210`).
2. In Supabase SQL Editor, run the following query after replacing the example number with your own:
   ```
   update public.user_roles r
   set role = 'admin'
   from auth.users u
   where r.user_id = u.id and u.phone = '+919876543210';
   ```
3. Sign out and sign back in. Your account will now open the Admin Dashboard.

Make yourself admin before the other nine people register. The six-account cap includes your admin account. If you want ten members plus one admin, change the limit logic and policy deliberately rather than just increasing a frontend number.

## 5. Add the information members should read
Sign in as admin. On the dashboard, use **Edit information shown to members** and save the page title and content. Members see this on their dashboard.

## 6. What the admin can see
- User name, mobile number, registration time
- Up to the latest 100 successful login events, with name, mobile number and timestamp
- Total registered accounts and remaining slots
- Editable member information page

The login log records successful authenticated sessions when the client loads the signed-in dashboard. It does not log failed passwords, and a browser cannot reliably prove a human actively viewed or read the page. Passwords are never selected, logged, or displayed.

## Security notes
- RLS restricts profiles and role visibility. Members can read only their own profile and role.
- Only admins can read login activity or edit member content.
- The admin role is assigned manually in SQL; public signup always creates a `member` role.
- Use a strong, unique admin password and enable MFA for the admin account if available.
- Do not collect phone numbers without telling users why you need them and how you will use them.
- The sample project uses the Supabase publishable/anon key in the browser; this is expected. Database access is protected by RLS. Never expose a service-role/secret key.
- Before production, configure a custom domain, HTTPS, backups, Supabase Auth rate limits/CAPTCHA or bot protection, and an SMS provider if verifying phone ownership.
- Account deletion and recovery should be handled through a trusted admin/server workflow, not by exposing service-role credentials in the browser.

## Troubleshooting
- **Registration cap reached:** all 6 profiles are occupied. Delete an account through a properly authenticated admin/server workflow if you need to free a slot.
- **Invalid phone:** enter E.164 format, e.g. `+919876543210`.
- **Phone login not available:** ensure Phone provider is enabled in Supabase Auth.
- **Profile missing after signup:** inspect the Supabase Auth logs and SQL trigger errors; do not disable the capacity trigger to bypass the error.
- **Admin sees member dashboard:** run the admin promotion SQL using the exact phone number and sign in again.
