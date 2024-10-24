export default function FeatureCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-64 flex-col justify-between gap-6 rounded-md bg-card p-4 pb-6'>
      {title && (
        <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
      )}

      {children}
    </div>
  );
}
