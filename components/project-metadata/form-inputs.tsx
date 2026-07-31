import React from 'react';
import { ProjectMetadata } from '@/utils/types';
import {
  CheckIcon,
  ChevronsUpDownIcon,
  MinusIcon,
  PlusIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import {
  CANONICAL_GEOGRAPHY_OPTIONS,
  CANONICAL_GEOGRAPHY_VALUE_SET,
  GEOGRAPHY_OPTION_GROUPS,
  normalizeProjectGeography,
} from '@/components/overview/country-impact-map/country-iso-map';

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
      className='flex-grow border border-input bg-background px-2 py-1 text-foreground'
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

type SelectInputProps = InputProps & {
  options: { value: string; label: string }[];
  legacyWarning?: string;
};

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  legacyWarning,
}) => {
  const warningId = React.useId();
  const hasLegacyValue =
    Boolean(value) && !options.some((option) => option.value === value);

  return (
    <div className='flex items-baseline gap-4'>
      <label
        className='w-40 flex-shrink-0 text-muted-foreground'
        htmlFor={name}
      >
        {label}:
      </label>
      <div className='flex flex-grow flex-col gap-1'>
        <div className='relative'>
          <select
            id={name}
            className='w-full appearance-none border border-input bg-background px-2 py-1 pr-8 text-foreground'
            name={name}
            value={value || ''}
            aria-describedby={hasLegacyValue ? warningId : undefined}
            onChange={
              onChange as unknown as React.ChangeEventHandler<HTMLSelectElement>
            }
          >
            {hasLegacyValue && (
              <option value={value ?? ''}>
                {value} (current value — decision required)
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronsUpDownIcon
            aria-hidden='true'
            className='pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50'
          />
        </div>
        {hasLegacyValue && legacyWarning && (
          <p id={warningId} className='text-amber-700 dark:text-amber-400'>
            {legacyWarning}
          </p>
        )}
      </div>
    </div>
  );
};

type GeographyComboboxInputProps = {
  value: string | null;
  onValueChange: (value: string | null) => void;
};

export const GeographyComboboxInput: React.FC<GeographyComboboxInputProps> = ({
  value,
  onValueChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const warningId = React.useId();
  const normalizedValue = normalizeProjectGeography(value);
  const hasLegacyValue =
    normalizedValue !== '' &&
    (value !== normalizedValue ||
      !CANONICAL_GEOGRAPHY_VALUE_SET.has(normalizedValue));

  return (
    <div className='flex items-baseline gap-4'>
      <label
        className='w-40 flex-shrink-0 text-muted-foreground'
        htmlFor='project_country'
      >
        Project Country:
      </label>
      <div className='flex min-w-0 flex-grow flex-col gap-1'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id='project_country'
              type='button'
              variant='outline'
              role='combobox'
              aria-expanded={open}
              aria-describedby={hasLegacyValue ? warningId : undefined}
              className='h-auto w-full justify-between px-2 py-1 text-xs font-normal'
            >
              <span className='truncate'>
                {normalizedValue || 'Not set'}
                {hasLegacyValue ? ' (current value — please reselect)' : ''}
              </span>
              <ChevronsUpDownIcon className='ml-2 h-3.5 w-3.5 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            portalled={false}
            className='w-[var(--radix-popover-trigger-width)] p-0'
            align='start'
          >
            <Command>
              <CommandInput placeholder='Search countries and regions…' />
              <CommandList>
                <CommandEmpty>No geography found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value='Not set'
                    onSelect={() => {
                      onValueChange(null);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        normalizedValue === '' ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    Not set
                  </CommandItem>
                </CommandGroup>
                {GEOGRAPHY_OPTION_GROUPS.map((group) => {
                  const options = CANONICAL_GEOGRAPHY_OPTIONS.filter(
                    (option) => option.group === group,
                  );
                  if (options.length === 0) return null;
                  return (
                    <CommandGroup key={group} heading={group}>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => {
                            onValueChange(option.value);
                            setOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              normalizedValue === option.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                })}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {hasLegacyValue && (
          <p id={warningId} className='text-amber-700 dark:text-amber-400'>
            Project Country contains a legacy value. You can save other fields
            unchanged, but changing this field requires a canonical selection.
          </p>
        )}
      </div>
    </div>
  );
};

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
        {contacts &&
          contacts.map((contact, index) => (
            <div key={index} className='flex items-center gap-2'>
              <input
                className='border border-input bg-background px-2 py-1 text-foreground'
                placeholder='Name'
                value={contact.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
              <input
                className='border border-input bg-background px-2 py-1 text-foreground'
                placeholder='Organisation'
                value={contact.organisation}
                onChange={(e) =>
                  handleChange(index, 'organisation', e.target.value)
                }
              />
              <button
                type='button'
                className='rounded p-1 transition-all hover:bg-muted'
                onClick={() => removeContact(index)}
                aria-label='Remove contact'
              >
                <MinusIcon size={16} />
              </button>
            </div>
          ))}
        <button
          type='button'
          className='flex items-center gap-1 self-start rounded border px-2 py-1 text-xs transition-all hover:bg-muted'
          onClick={addContact}
        >
          <PlusIcon size={16} /> Add Contact
        </button>
      </div>
    </div>
  );
};
