export default function Page() {
  const headings = [
    'Project & Regional strategy & Start date',
    'Pillars and unit reqs',
    'Impact',
    // 'Outcome',
    // 'Project timeline/age',
    'Project contacts',
    'Funding status and current funders',
    // 'Unit requirements',
    'Issues',
    // 'Exit strategy',
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
      local_partners: [
        'Marine Resources (Francis Binney)',
        'Jersey Marine Dudes (Kevin McMac)',
      ],
    },
    {
      project: 'Seasafe',
      regional_strategy: 'Mediterranean',
      pillars: 'Monitor, Respond, Educate',
      impact: 'Enhance maritime safety and awareness',
      outcome: 'Reduction in maritime accidents',
      start_date: 'March 2019',
      project_contacts: 'Alice Harper',
      funding_status: 'Fully funded',
      current_funders: 'EU, private, UN',
      unit_requirements: 'Safety, Education, Marine Biology',
      issues: 'High initial setup costs',
      exit_strategy:
        'Integrate into local coastguard operations by December 2024',
      local_partners: [
        'Med Maritime Safety (Carlos Diaz)',
        'SeaWatch (Amir Khan)',
      ],
    },
    {
      project: 'AquaClean',
      regional_strategy: 'South Pacific',
      pillars: 'Clean, Restore, Sustain',
      impact: 'Restore coral reefs and marine habitats',
      outcome: 'Revival of marine biodiversity',
      start_date: 'June 2018',
      project_contacts: 'John Smith',
      funding_status: 'Partially funded',
      current_funders: 'Greenpeace, private, local government',
      unit_requirements: 'Marine Biology, Environmental Science, Logistics',
      issues: 'Logistical challenges in remote areas',
      exit_strategy:
        'Hand over to local environmental groups by September 2026',
      local_partners: [
        'Pacific Environmental Network (Lani Hekili)',
        'Coral Guardians (Niko Kaipo)',
      ],
    },
    {
      project: 'OceanShield',
      regional_strategy: 'Indian Ocean',
      pillars: 'Protect, Enforce, Collaborate',
      impact: 'Reduce illegal fishing activities',
      outcome: 'Increased fish populations',
      start_date: 'February 2021',
      project_contacts: 'Priya Patel',
      funding_status: 'Needs funding',
      current_funders: 'WWF, private, regional governments',
      unit_requirements: 'Law Enforcement, Marine Biology, Technology',
      issues: 'Political instability in the region',
      exit_strategy:
        'Transfer responsibilities to local authorities by May 2027',
      local_partners: [
        'Indian Ocean Marine Patrol (Arun Das)',
        'FishWatch (Sana Alvi)',
      ],
    },
    {
      project: 'BlueHarvest',
      regional_strategy: 'Caribbean',
      pillars: 'Harvest, Conserve, Empower',
      impact: 'Promote sustainable fishing practices',
      outcome: 'Sustainable livelihoods for local fishers',
      start_date: 'August 2020',
      project_contacts: 'Maria Gonzalez',
      funding_status: 'Fully funded',
      current_funders: 'World Bank, private, local businesses',
      unit_requirements: 'Sustainability, Economics, Community Engagement',
      issues: 'Climate change impacts',
      exit_strategy: 'Empower local fishing cooperatives by November 2025',
      local_partners: [
        'Caribbean Fishers Union (Javier Ruiz)',
        'Ocean Sustainability Group (Linda Brown)',
      ],
    },
    {
      project: 'ReefProtect',
      regional_strategy: 'Great Barrier Reef',
      pillars: 'Preserve, Monitor, Educate',
      impact: 'Protect and preserve coral reef ecosystems',
      outcome: 'Improved health of the Great Barrier Reef',
      start_date: 'April 2017',
      project_contacts: 'Tom Edwards',
      funding_status: 'Partially funded',
      current_funders: 'Australian Government, private, UNESCO',
      unit_requirements: 'Marine Biology, Education, Technology',
      issues: 'Coral bleaching and climate change',
      exit_strategy: 'Collaborate with local organizations by October 2023',
      local_partners: [
        'Reef Guardians (Sarah Thompson)',
        'Coral Care (Mia Johnson)',
      ],
    },
    {
      project: 'DeepBlue',
      regional_strategy: 'Arctic',
      pillars: 'Research, Adapt, Preserve',
      impact: 'Understand and mitigate effects of climate change',
      outcome: 'Comprehensive data on Arctic marine ecosystems',
      start_date: 'December 2016',
      project_contacts: 'Lars Svensson',
      funding_status: 'Needs funding',
      current_funders: 'Norwegian Government, private, Arctic Council',
      unit_requirements: 'Research, Climate Science, Logistics',
      issues: 'Extreme weather conditions and accessibility',
      exit_strategy: 'Develop local research capabilities by March 2028',
      local_partners: [
        'Arctic Research Institute (Olga Petrov)',
        'Polar Conservation Group (Hanna Niemi)',
      ],
    },
  ];

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2>Project Metadata</h2>
      </div>
      <table className='text-xs'>
        <thead>
          <tr className='border-b'>
            <td className='px-1 py-2 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Project</p>
                <p className='text-foreground/80'>Regional Strategy</p>
                <p className='text-foreground/80'>Start Date</p>
              </div>
            </td>
            <td className='px-1 py-2 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Pillars</p>
                <p className='text-foreground/80'>Unit Requirements</p>
              </div>
            </td>
            <td className='px-1 py-2 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Impact</p>
              </div>
            </td>
            <td className='px-1 py-2 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Project contacts</p>
              </div>
            </td>
            <td className='px-1 py-2 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Funding status</p>
                <p className='text-foreground/80'>Current Funders</p>
              </div>
            </td>
            <td className='px-1 py-2 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Issues</p>
              </div>
            </td>
            <td className='px-1 py-2 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Local Contacts</p>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          {exampleData.map((entry) => {
            return (
              <tr key={entry.project} className='even:bg-white/10'>
                <td className='px-1 py-2 align-baseline'>
                  <div className='flex flex-col gap-1'>
                    <p>{entry.project}</p>
                    <p className='text-foreground/80'>
                      {entry.regional_strategy}
                    </p>
                    <p className='text-foreground/80'>
                      <p>{entry.start_date}</p>
                    </p>
                  </div>
                </td>
                <td className='px-1 py-2 align-baseline'>
                  <div className='flex flex-col gap-1'>
                    <p>{entry.pillars}</p>
                    <p className='text-foreground/80'>
                      {entry.unit_requirements}
                    </p>
                  </div>
                </td>
                <td className='px-1 py-2 align-baseline'>
                  <div className='flex flex-col gap-1'>
                    <p>{entry.impact}</p>
                  </div>
                </td>
                {/* <td className='px-1 py-2 align-baseline'>
              <div className='flex flex-col gap-1'>
              <p>{entry.outcome}</p>
              </div>
              </td> */}
                <td className='px-1 py-2 align-baseline'>
                  <div className='flex flex-col gap-1'>
                    <p>{entry.project_contacts}</p>
                  </div>
                </td>
                <td className='px-1 py-2 align-baseline'>
                  <div className='flex flex-col gap-1'>
                    <p>{entry.funding_status}</p>
                    <p className='text-foreground/80'>
                      {entry.current_funders}
                    </p>
                  </div>
                </td>
                <td className='px-1 py-2 align-baseline'>
                  <div className='flex flex-col gap-1'>
                    <p>{entry.issues}</p>
                  </div>
                </td>
                <td className='px-1 py-2 align-baseline'>
                  <div className='flex flex-col gap-1'>
                    <p>
                      {entry.local_partners.map((partner) => {
                        return (
                          <>
                            <span className='block' key={partner}>
                              {partner}
                            </span>
                          </>
                        );
                      })}
                    </p>
                  </div>
                </td>
                {/* <td className='px-1 py-2 align-baseline'>
                  <div className='flex flex-col gap-1'>
                    <p>{entry.exit_strategy}</p>
                  </div>
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

{
  /* {Object.entries(entry).map(([key, value]) => {
                  return (
                    <td key={key} className='text-left align-top'>
                      {value}
                    </td>
                  );
                })} */
}
