import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface ControlledListboxProps {
  label: string;
  options: {
    name: string;
    value: string | number;
    parent: boolean;
    impact_indicator?: string | undefined;
  }[];
  onSelect: (value: string | number) => void;
  initialValue: string | number;
}

export default function ControlledCombobox({
  label,
  options,
  onSelect,
  initialValue,
}: ControlledListboxProps) {
  const initialOption = options.find((option) => initialValue === option.value);

  const [selected, setSelected] = useState(
    initialOption ? initialOption : options[1] // [0] will always be a higher level output
  );

  useEffect(() => {
    setSelected(initialOption ? initialOption : options[1]); // [0] will always be a higher level output
  }, [options]);

  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div>
      <Combobox
        value={selected}
        onChange={(value) => {
          setSelected(value);
          onSelect(value.value);
        }}
      >
        <div className='flex justify-start items-start gap-8 text-sm'>
          <Combobox.Label className='block basis-1/5 pt-2  text-foreground/80'>
            {label}
          </Combobox.Label>
          <div className='relative basis-4/5'>
            <div className='relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 '>
              <Combobox.Input
                className='w-full border-none py-2 pl-3 pr-10 leading-5 bg-foreground/10 text-foreground focus:ring-0'
                displayValue={({ name }: { name: string }) => name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
                <ChevronUpDownIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-600 py-1 text-base shadow-lg z-10 ring-1 ring-black/5 focus:outline-none sm:text-sm'>
                {filteredOptions.length === 0 && query !== '' ? (
                  <div className='relative cursor-default select-none px-4 py-2 text-foregruond/90'>
                    Nothing found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? 'bg-purple-100 text-purple-900'
                            : 'text-foreground'
                        }`
                      }
                      value={option}
                      disabled={option.parent}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            } ${
                              option.parent ? '-ml-6 text-foreground/75' : ''
                            }`}
                          >
                            {option.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-purple-900' : 'text-foreground'
                              }`}
                            >
                              <CheckIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>

            {selected.impact_indicator && (
              <p className='inline-block mt-3 px-3 py-2 text-xs bg-sky-900/75 rounded-lg'>
                Impact Indicator: {selected.impact_indicator}
              </p>
            )}
          </div>
        </div>
      </Combobox>
    </div>
  );
}
