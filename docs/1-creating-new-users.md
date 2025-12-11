# Creating new users

Sign up functionality is disabled via Supabase. To create a new user:

1. Manually create an auth user in Supabase (suggest automatically creating the user with email and password)
2. Manually create a database user in `public.users`
3. The user can now log in with Microsoft SSO
4. The user can now reset their password by logging in via https://maerl.bluemarinefoundation.com/sign-in-email
5. Email signin is available at https://maerl.bluemarinefoundation.com/reset-password
