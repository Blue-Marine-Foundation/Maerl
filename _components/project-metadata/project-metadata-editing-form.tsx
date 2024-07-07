import { ProjectMetadata } from '@/_lib/types';
import { useState, forwardRef, useCallback } from 'react';
import ProjectMetadataServerAction from './server-action';
import { PlusIcon } from 'lucide-react';

type TextInputProps = {
  label: string;
  name: keyof ProjectMetadata;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className='flex gap-4 items-baseline'>
    <h3 className='text-muted-foreground flex-shrink-0 w-40'>{label}:</h3>
    <input
      className='flex-grow bg-white/10 px-2 py-1 text-foreground'
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

type JsonbInputProps = {
  label: string;
  field: keyof ProjectMetadata;
  entries: any[];
  handleJsonbChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    key: string
  ) => void;
  handleAddEntry: () => void;
  entryTemplate: any;
};

const JsonbInput: React.FC<JsonbInputProps> = ({
  label,
  field,
  entries,
  handleJsonbChange,
  handleAddEntry,
  entryTemplate,
}) => (
  <div className='flex gap-4 items-baseline'>
    <h3 className='text-muted-foreground flex-shrink-0 w-40'>{label}:</h3>
    <div className='text-foreground flex-grow flex flex-col items-start gap-2'>
      {entries.map((entry, index) => (
        <div key={index} className='flex gap-1'>
          {Object.keys(entryTemplate).map((key) => (
            <input
              key={key}
              className=' bg-white/10 px-2 py-1 text-foreground'
              name={key}
              value={entry[key] || ''}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              onChange={(e) => handleJsonbChange(e, index, key)}
            />
          ))}
        </div>
      ))}
      <button
        type='button'
        className='text-xs flex gap-1 items-center border rounded py-1 px-2 hover:bg-white/10 transition-all'
        onClick={handleAddEntry}
      >
        <PlusIcon size={16} /> Add {label.split(' ')[1]}
      </button>
    </div>
  </div>
);

const EditableProjectMetadataForm = forwardRef<
  HTMLFormElement,
  {
    entry: ProjectMetadata;
    onSubmitSuccess: (formState: ProjectMetadata) => void;
  }
>(({ entry, onSubmitSuccess }, ref) => {
  const [formState, setFormState] = useState<ProjectMetadata>(entry);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormState((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleJsonbChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
      key: string,
      field: keyof ProjectMetadata
    ) => {
      const { value } = e.target;
      setFormState((prev) => {
        // @ts-expect-error
        const updatedField = [...(prev[field] || [])];
        updatedField[index] = { ...updatedField[index], [key]: value };
        return { ...prev, [field]: updatedField };
      });
    },
    []
  );

  const handleAddJsonbEntry = useCallback(
    (field: keyof ProjectMetadata, newEntry: any) => {
      setFormState((prev) => ({
        ...prev,
        // @ts-expect-error
        [field]: [...(prev[field] || []), newEntry],
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filteredFormState = {
      ...formState,
      funders:
        formState.funders?.filter((funder) => funder.name.trim() !== '') || [],
      project_contacts:
        formState.project_contacts?.filter(
          (contact) =>
            contact.name.trim() !== '' ||
            (contact.organisation?.trim() ?? '') !== ''
        ) || [],
      local_partners:
        formState.local_partners?.filter(
          (partner) =>
            partner.person?.trim() !== '' || partner.organisation?.trim() !== ''
        ) || [],
    };

    const { data, error } = await ProjectMetadataServerAction(
      filteredFormState
    );
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
    onSubmitSuccess(filteredFormState);
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className='flex flex-col gap-4 py-6'
    >
      <TextInput
        label='Regional Strategy'
        name='regional_strategy'
        value={formState.regional_strategy || ''}
        onChange={handleChange}
        placeholder='Regional Strategy'
      />
      <TextInput
        label='Start Date'
        name='start_date'
        value={formState.start_date || ''}
        onChange={handleChange}
        placeholder='Project start date'
      />
      <TextInput
        label='Pillars'
        name='pillars'
        value={formState.pillars || ''}
        onChange={handleChange}
        placeholder='Pillars'
      />
      <TextInput
        label='Unit Requirements'
        name='unit_requirements'
        value={formState.unit_requirements || ''}
        onChange={handleChange}
        placeholder='Unit requirements'
      />
      <JsonbInput
        label='Project Contacts'
        field='project_contacts'
        entries={formState.project_contacts || []}
        handleJsonbChange={(e, index, key) =>
          handleJsonbChange(e, index, key, 'project_contacts')
        }
        handleAddEntry={() =>
          handleAddJsonbEntry('project_contacts', {
            name: '',
            organisation: '',
          })
        }
        entryTemplate={{ name: '', organisation: '' }}
      />
      <TextInput
        label='Funding Status'
        name='funding_status'
        value={formState.funding_status || ''}
        onChange={handleChange}
        placeholder='Funding status'
      />
      <JsonbInput
        label='Current Funders'
        field='funders'
        entries={formState.funders || []}
        handleJsonbChange={(e, index, key) =>
          handleJsonbChange(e, index, key, 'funders')
        }
        handleAddEntry={() => handleAddJsonbEntry('funders', { name: '' })}
        entryTemplate={{ name: '' }}
      />
      <JsonbInput
        label='Local Partners'
        field='local_partners'
        entries={formState.local_partners || []}
        handleJsonbChange={(e, index, key) =>
          handleJsonbChange(e, index, key, 'local_partners')
        }
        handleAddEntry={() =>
          handleAddJsonbEntry('local_partners', {
            organisation: '',
            person: '',
          })
        }
        entryTemplate={{ organisation: '', person: '' }}
      />
      <TextInput
        label='Issues'
        name='project_issues'
        value={formState.project_issues || ''}
        onChange={handleChange}
        placeholder='Project issues'
      />
      <TextInput
        label='Exit Strategy'
        name='exit_strategy'
        value={formState.exit_strategy || ''}
        onChange={handleChange}
        placeholder='Exit strategy'
      />
      <div className='flex gap-4 items-baseline'>
        <h3 className='text-muted-foreground flex-shrink-0 w-40'>Impact:</h3>
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
        <h3 className='text-muted-foreground flex-shrink-0 w-40'>Outcomes:</h3>
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
    </form>
  );
});

export default EditableProjectMetadataForm;
