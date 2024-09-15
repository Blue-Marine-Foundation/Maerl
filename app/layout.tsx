import Header from '@/_components/header/header'
import Footer from '@/_components/footer/footer'
import './globals.css'
import { createClient } from '@/_utils/supabase/server'
import Login from '@/_components/LogInHomepage'

export const metadata = {
  title: 'Maerl',
  description: 'Impact reporting',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()

  const session = data.session ? true : false

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Header withSession={session} />
        <main className="w-full max-w-[1376px] mx-auto px-4">
          {session ? <>{children}</> : <Login />}
        </main>
        <Footer />
      </body>
    </html>
  )
}
