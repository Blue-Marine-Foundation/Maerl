export default function Page() {
  const headings = [
    'Project',
    'Regional strategy',
    'Pillars',
    'Impact',
    'Outcome',
    'Project timeline/age',
    'Project contacts',
    'Fully funded',
    'Current funders',
    'Unit requirements',
    'Issues',
    'Exit strategy',
    'Local partners',
  ];

  const exampleData = [
    {
      project: 'Jersey',
      regional_strategy: 'North Atlantic',
      pillars: 'Connect, Protec, Attac',
      impact: 'Deliver the people of Jersey from heretical naysaying',
      outcome: 'Dissolution of the union',
      start_date: 'January 2020',
      project_contacts: 'Freddie Watson',
      funding_status: 'Needs funding',
      current_funders: 'Barclays, private, private',
      unit_requirements: 'Legal, Education, Economics',
      issues: 'Political tensions are tight; fishers are rebelling',
      exit_strategy: 'Hand it over to the locals in June 2025',
      local_partners:
        'Marine Resources (Francis Binney), Jersey Marine Dudes (Kevin McMac)',
    },
  ];

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2>Project Metadata</h2>
      </div>
      <table className='text-xs'>
        <thead>
          <tr>
            {headings.map((heading) => {
              return (
                <td key={heading} className='text-left align-top'>
                  {heading}
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {exampleData.map((entry) => {
            return (
              <tr key={entry.project}>
                {Object.entries(entry).map(([key, value]) => {
                  return (
                    <td key={key} className='text-left align-top'>
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
