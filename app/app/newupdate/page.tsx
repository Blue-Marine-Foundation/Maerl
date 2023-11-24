import { createClient } from '@/_utils/supabase/server';
import UpdateForm from './updateform';
import { Output, Project } from '@/_lib/types';

function createNestedOutputList(data: Project) {
  let outputsMap: { [key: number]: Output } = {};

  if (data.outputs) {
    data.outputs.forEach((output) => {
      outputsMap[output.id] = output;
      output.output_measurables = []; // Initialize the output_measurables array
    });
  }

  if (data.output_measurables) {
    data.output_measurables.forEach((measurable) => {
      if (outputsMap[measurable.output_id]) {
        outputsMap[measurable.output_id].output_measurables!.push(measurable);
      }
    });
  }

  return data;
}

export default async function NewUpdate() {
  const supabaseClient = createClient();
  const { data: projects, error } = await supabaseClient
    .from('projects')
    .select(`*, outputs (*), output_measurables (*)`);

  if (!projects) {
    return (
      <div>
        <h1>Error connecting to database</h1>
      </div>
    );
  }

  const parsedData = projects.map((d) => createNestedOutputList(d));

  return (
    <div>
      <h1 className='mb-8 text-xl font-medium'>Add an update</h1>
      {parsedData && <UpdateForm data={parsedData} />}
    </div>
  );
}
