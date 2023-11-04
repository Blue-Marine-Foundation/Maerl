import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { PRODUCTION_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      `${PRODUCTION_URL}/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  return NextResponse.redirect(`${PRODUCTION_URL}/dashboard`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
