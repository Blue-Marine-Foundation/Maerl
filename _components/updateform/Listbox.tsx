import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface ControlledListboxProps {
  label: string;
  options: {
    name: string;
    value: string | number;
  }[];
  onSelect: (value: string | number) => void;
}

export default function ControlledListbox({
  label,
  options,
  onSelect,
}: ControlledListboxProps) {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className='mb-4'>
      <label className='block mb-2 pl-1 text-sm text-foreground/80'>
        {label}
      </label>
      <Listbox
        value={selected}
        onChange={(value) => {
          setSelected(value);
          onSelect(value.value);
        }}
      >
        <div className='relative mt-1'>
          <Listbox.Button className='relative w-full cursor-default rounded-lg bg-foreground/10 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300'>
            <span className='block truncate'>{selected.name}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-600 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {options.map((option, optionIdx) => {
                const isSelected = option.value === selected.value;

                return (
                  <Listbox.Option
                    key={optionIdx}
                    className={`relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-purple-100 hover:text-purple-900 ${
                      isSelected
                        ? 'bg-purple-100 text-purple-900'
                        : 'text-foreground'
                    }`}
                    value={option}
                  >
                    <>
                      <span
                        className={`block truncate ${
                          isSelected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.name}
                      </span>
                      {isSelected && (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600'>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      )}
                    </>
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
