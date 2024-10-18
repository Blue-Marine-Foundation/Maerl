import React from 'react';
import { ProjectMetadata } from '@/utils/types';
import { PlusIcon, MinusIcon } from 'lucide-react';

type InputProps = {
  label: string;
  name: keyof ProjectMetadata;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

export const TextInput: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className='flex items-baseline gap-4'>
    <label className='w-40 flex-shrink-0 text-muted-foreground' htmlFor={name}>
      {label}:
    </label>
    <input
      id={name}
      className='flex-grow bg-white/10 px-2 py-1 text-foreground'
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

type SelectInputProps = InputProps & {
  options: { value: string; label: string }[];
};

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div className='flex items-baseline gap-4'>
    <label className='w-40 flex-shrink-0 text-muted-foreground' htmlFor={name}>
      {label}:
    </label>
    <select
      id={name}
      className='flex-grow bg-white/10 px-2 py-1 text-foreground'
      name={name}
      value={value || ''}
      onChange={
        onChange as unknown as React.ChangeEventHandler<HTMLSelectElement>
      }
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

type LocalContactInputProps = {
  contacts: ProjectMetadata['local_contacts'];
  onChange: (contacts: ProjectMetadata['local_contacts']) => void;
};

export const LocalContactInput: React.FC<LocalContactInputProps> = ({
  contacts,
  onChange,
}) => {
  const handleChange = (
    index: number,
    field: 'name' | 'organisation',
    value: string,
  ) => {
    const updatedContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact,
    );
    onChange(updatedContacts);
  };

  const addContact = () => {
    onChange([...contacts, { name: '', organisation: '' }]);
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    onChange(updatedContacts);
  };

  return (
    <div className='flex max-w-full items-baseline gap-4'>
      <label className='w-40 text-muted-foreground'>Local Contacts:</label>
      <div className='flex grow flex-col gap-2'>
        {contacts.map((contact, index) => (
          <div key={index} className='flex items-center gap-2'>
            <input
              className='bg-white/10 px-2 py-1 text-foreground'
              placeholder='Name'
              value={contact.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />
            <input
              className='bg-white/10 px-2 py-1 text-foreground'
              placeholder='Organisation'
              value={contact.organisation}
              onChange={(e) =>
                handleChange(index, 'organisation', e.target.value)
              }
            />
            <button
              type='button'
              className='rounded p-1 transition-all hover:bg-white/10'
              onClick={() => removeContact(index)}
              aria-label='Remove contact'
            >
              <MinusIcon size={16} />
            </button>
          </div>
        ))}
        <button
          type='button'
          className='flex items-center gap-1 self-start rounded border px-2 py-1 text-xs transition-all hover:bg-white/10'
          onClick={addContact}
        >
          <PlusIcon size={16} /> Add Contact
        </button>
      </div>
    </div>
  );
};
