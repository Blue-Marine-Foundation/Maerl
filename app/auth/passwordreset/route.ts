import { createClient } from '@/_utils/supabase/server';
import { NextResponse } from 'next/server';
import { PRODUCTION_URL } from '@/_lib/constants';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const new_password = String(formData.get('new_password'));

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({ password: new_password });

  if (error) {
    console.log(error);
    return NextResponse.redirect(
      `${PRODUCTION_URL}/dashboard/account/passwordreset?error=Could not reset password`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${PRODUCTION_URL}/dashboard/account/passwordreset/success`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  );
}
