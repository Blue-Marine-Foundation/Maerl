# Creating new users

Sign up functionality is disabled via Supabase. To create a new user:

1. Manually create an auth user in Supabase (suggest automatically creating the user with email and password)
2. Manually create a database user in `public.users`
3. Set the `role` in `public.users.role`:
   - `Admin`
   - `Project Manager` (Blue Marine staff)
   - `Partner` (external project partner)
4. If the user role is `Admin`, skip ahead
5. If the user role is `Project Manager` **or** `Partner`, assign projects to the user in `user_projects`
6. Ensure RLS policies include Partner access (see `docs/3-partner-role-rls.sql`)
7. The user can now log in with Microsoft SSO
8. The user can now reset their password by logging in via https://maerl.bluemarinefoundation.com/sign-in-email
9. Email signin is available at https://maerl.bluemarinefoundation.com/reset-password
