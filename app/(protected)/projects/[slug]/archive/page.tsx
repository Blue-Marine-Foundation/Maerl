import ArchivedOutputs from './archived-outputs';
import ArchivedOutputIndicators from './archived-output-indicators';
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
      <h2 className='text-xl font-semibold'>Archived output indicators</h2>
      <ArchivedOutputIndicators slug={slug as string} />
    </div>
  );
}
