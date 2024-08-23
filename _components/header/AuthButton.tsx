import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <p>
          <Link href="/app/account"> {user.email}</Link>
        </p>
        <form action="/auth/sign-out" method="post">
          <button className="py-1.5 px-3 rounded-md no-underline border hover:bg-btn-background-hover text-sm transition-all duration-500">
            Log out
          </button>
        </form>
      </div>
    );
  }
}
