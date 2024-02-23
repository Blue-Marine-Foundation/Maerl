# Maerl

### An impact reporting web app for Blue Marine Foundation and friends

Clone the repo then run `npm i` followed by `npx next dev` to run the app locally.

### Dev docs

- `/dashboard` is a protected route. Unauthenticated users are redirected.
- Password resets are only available for logged in users. The request password reset email acts as a magic link that logs in the user to enable them to change their password.
- `/dashboard/account/passwordreset` only works in production.
- RLS policy on `users` db table allows select access where `(id = auth.uid())`

### How to add a logframe 

- If a ghost Output is added to a project it's because it's listed under Outcomes
