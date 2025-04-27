import ArchivedOutputs from './archived-outputs';

export default async function ProjectArchive({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className='space-y-8'>
      <h2 className='text-xl font-semibold'>Archived outputs</h2>
      <ArchivedOutputs slug={slug as string} />
    </div>
  );
}
