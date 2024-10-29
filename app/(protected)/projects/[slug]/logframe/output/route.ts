import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  // Redirect to the parent logframe page
  redirect(`/projects/${slug}/logframe`);
}
