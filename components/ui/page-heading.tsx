export default function PageHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className='max-w-lg text-2xl font-bold'>{children}</h1>;
}
