import { ProjectMetadata } from '@/_lib/types';
import { useState } from 'react';
import ProjectMetadataServerAction from './server-action';

export default function EditableProjectMetadataForm({
  entry,
}: {
  entry: ProjectMetadata;
}) {
  const [formState, setFormState] = useState(entry);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleJsonbChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    index: number,
    key: string
  ) => {
    const { value } = e.target;
    setFormState((prev) => {
      // @ts-expect-error
      const updatedField = [...(prev[field] || [])];
      updatedField[index] = { ...updatedField[index], [key]: value };
      return { ...prev, [field]: updatedField };
    });
  };

  const handleAddJsonbEntry = (field: string, newEntry: object) => {
    setFormState((prev) => ({
      ...prev,
      // @ts-expect-error
      [field]: [...(prev[field] || []), newEntry],
    }));
  };

  const handleSubmit = async () => {
    const { data, error } = await ProjectMetadataServerAction(formState);
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
  };

  return (
    <div className='flex flex-col gap-4 py-6'>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Regional Strategy:</h3>
        <input
          className='flex-grow bg-white/10 px-2 py-1 text-foreground'
          name='regional_strategy'
          value={formState.regional_strategy || ''}
          onChange={handleChange}
        />
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Start Date:</h3>
        <input
          className='flex-grow bg-white/10 px-2 py-1 text-foreground'
          name='start_date'
          type='string'
          value={formState.start_date || ''}
          onChange={handleChange}
        />
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Pillars:</h3>
        <input
          className='flex-grow bg-white/10 px-2 py-1 text-foreground'
          name='pillars'
          value={formState.pillars || ''}
          onChange={handleChange}
        />
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Unit Requirements:</h3>
        <input
          className='flex-grow bg-white/10 px-2 py-1 text-foreground'
          name='unit_requirements'
          value={formState.unit_requirements || ''}
          onChange={handleChange}
        />
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Project Contacts:</h3>
        <div className='text-foreground flex-grow flex flex-col gap-2'>
          {formState.project_contacts &&
            formState.project_contacts.map((contact, index) => (
              <div key={index} className='flex flex-col gap-1'>
                <input
                  className=' bg-white/10 px-2 py-1 text-foreground'
                  name='name'
                  value={contact.name}
                  onChange={(e) =>
                    handleJsonbChange(e, 'project_contacts', index, 'name')
                  }
                />
                <input
                  className=' bg-white/10 px-2 py-1 text-foreground'
                  name='organisation'
                  value={contact.organisation || ''}
                  onChange={(e) =>
                    handleJsonbChange(
                      e,
                      'project_contacts',
                      index,
                      'organisation'
                    )
                  }
                />
              </div>
            ))}
          <button
            onClick={() =>
              handleAddJsonbEntry('project_contacts', {
                name: '',
                organisation: '',
              })
            }
          >
            Add Contact
          </button>
        </div>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Funding Status:</h3>
        <input
          className='flex-grow bg-white/10 px-2 py-1 text-foreground'
          name='funding_status'
          value={formState.funding_status || ''}
          onChange={handleChange}
        />
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Current Funders:</h3>
        <div className='text-foreground flex-grow flex flex-col gap-2'>
          {formState.funders &&
            formState.funders.map((funder, index) => (
              <input
                key={index}
                className=' bg-white/10 px-2 py-1 '
                name='name'
                value={funder.name}
                onChange={(e) => handleJsonbChange(e, 'funders', index, 'name')}
              />
            ))}
          <button onClick={() => handleAddJsonbEntry('funders', { name: '' })}>
            Add Funder
          </button>
        </div>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Local Partners:</h3>
        <div className='text-foreground flex-grow flex flex-col gap-2'>
          {formState.local_partners &&
            formState.local_partners.map((partner, index) => (
              <div key={index} className='grid grid-cols-2 gap-2'>
                <input
                  className='bg-white/10 px-2 py-1 '
                  name='name'
                  value={partner.name}
                  placeholder='Name'
                  onChange={(e) =>
                    handleJsonbChange(e, 'local_partners', index, 'name')
                  }
                />
                <input
                  className='bg-white/10 px-2 py-1 '
                  name='organisation'
                  value={partner.organisation || ''}
                  placeholder='Organisation'
                  onChange={(e) =>
                    handleJsonbChange(
                      e,
                      'local_partners',
                      index,
                      'organisation'
                    )
                  }
                />
              </div>
            ))}
          <button
            onClick={() =>
              handleAddJsonbEntry('local_partners', {
                name: '',
                organisation: '',
              })
            }
          >
            Add Partner
          </button>
        </div>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Issues:</h3>
        <input
          className='flex-grow bg-white/10 px-2 py-1 text-foreground'
          name='project_issues'
          value={formState.project_issues || ''}
          onChange={handleChange}
        />
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Exit Strategy:</h3>
        <input
          className='flex-grow bg-white/10 px-2 py-1 text-foreground'
          name='exit_strategy'
          value={formState.exit_strategy || ''}
          onChange={handleChange}
        />
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Impact:</h3>
        <div className='text-foreground flex-grow'>
          {entry.stub ? (
            <p>Project has no logframe yet</p>
          ) : (
            formState.impacts &&
            formState.impacts.map((impact) => (
              <p key={impact.id}>{impact.title}</p>
            ))
          )}
        </div>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Outcomes:</h3>
        <div className='text-foreground flex-grow'>
          {entry.stub ? (
            <p>Project has no logframe yet</p>
          ) : (
            formState.outcomes &&
            formState.outcomes.map((outcome) => (
              <p key={outcome.id}>
                <span className='font-medium'>{outcome.code}</span>{' '}
                {outcome.description}
              </p>
            ))
          )}
        </div>
      </div>
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
