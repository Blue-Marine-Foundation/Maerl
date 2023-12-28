import { createClient } from '@/_utils/supabase/server';

export default async function WelcomeMessage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className='mb-8'>Welcome back!</p>;
  }

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id);

  return (
    <p>Welcome back{userDetails ? `, ${userDetails[0].first_name}!` : '!'}</p>
  );
}
