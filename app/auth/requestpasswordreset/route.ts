import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { PRODUCTION_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${PRODUCTION_URL}/auth/callback?next=/app/account/passwordreset`,
  });

  if (error) {
    console.log(error);
    return NextResponse.redirect(
      `${PRODUCTION_URL}/requestpasswordreset?error=${error.message}`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${PRODUCTION_URL}/requestpasswordreset?message=Password reset email sent to ${email}`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  );
}
