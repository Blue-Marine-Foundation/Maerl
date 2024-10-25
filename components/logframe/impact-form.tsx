'use client';

export default function ImpactForm() {
  const impact = null;

  return (
    <div className='flex flex-col gap-4 rounded-lg bg-card p-4 pb-8'>
      <p>Impact</p>
      {impact ? (
        <p>{impact}</p>
      ) : (
        <p className='text-muted-foreground'>
          No impact yet; it sure would be nice to write one!
        </p>
      )}
    </div>
  );
}
