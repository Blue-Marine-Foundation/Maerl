import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { PRODUCTION_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(PRODUCTION_URL, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
