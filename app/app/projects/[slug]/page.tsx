import { supabase } from '@/utils/supabase/servicerole';
import { createClient } from '@/_utils/supabase/server';
import { notFound } from 'next/navigation';
import { Params } from '@/lib/types';

export async function generateStaticParams() {
  const { data: projects, error } = await supabase.from('projects').select('*');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects.map((project) => ({
    slug: project.name,
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  return {
    title: `${params.slug} | Maerl`,
  };
}

export default async function Project({ params }: { params: Params }) {
  const things = ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4'];

  return (
    <div className='animate-in'>
      <div className='grid grid-cols-2 gap-8'>
        {things.map((thing) => {
          return (
            <div
              key={thing}
              className='min-h-[250px] flex justify-center items-center text-lg text-slate-400 bg-card-bg rounded-md shadow'
            >
              <p>{thing}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
