import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString();

  // Handle OAuth errors (e.g., user denied consent, configuration issues)
  if (error) {
    const errorMessage = errorDescription || error || 'Authentication failed';
    return NextResponse.redirect(
      `${origin}/sign-in-sso?error=${encodeURIComponent(errorMessage)}`,
    );
  }

  // Handle missing code parameter
  if (!code) {
    return NextResponse.redirect(
      `${origin}/sign-in-sso?error=${encodeURIComponent('No authorization code received')}`,
    );
  }

  // Exchange code for session
  try {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Session exchange error:', exchangeError);
      return NextResponse.redirect(
        `${origin}/sign-in-sso?error=${encodeURIComponent(exchangeError.message || 'Failed to create session')}`,
      );
    }
  } catch (err) {
    console.error('Unexpected error during session exchange:', err);
    return NextResponse.redirect(
      `${origin}/sign-in-sso?error=${encodeURIComponent('An unexpected error occurred during authentication')}`,
    );
  }

  // Redirect to specified path or home page
  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/`);
}
