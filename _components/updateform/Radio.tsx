import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';

const options = [{ name: 'Impact' }, { name: 'Progress' }];

// @ts-ignore
function CheckIcon(props) {
  return (
    <svg viewBox='0 0 24 24' fill='none' {...props}>
      <circle cx={12} cy={12} r={12} fill='#fff' opacity='0.2' />
      <path
        d='M7 13l3 3 7-7'
        stroke='#fff'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

interface ControlledRadioProps {
  label: string;
  onChange: (value: string) => void;
}

export default function ControlledRadio({
  label,
  onChange,
}: ControlledRadioProps) {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className='w-full'>
      <RadioGroup
        value={selected}
        onChange={(value) => {
          setSelected(value);
          onChange(value.name);
        }}
      >
        <div className='flex justify-start items-center gap-8'>
          <RadioGroup.Label className='block basis-1/5 text-sm text-foreground/80'>
            {label}
          </RadioGroup.Label>
          <div className='basis-4/5 flex justify-start items-center gap-4 text-sm'>
            {options.map((option) => (
              <RadioGroup.Option
                key={option.name}
                value={option}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-1 ring-white/60 ring-offset-1 ring-offset-sky-300'
                      : ''
                  }
                  ${checked ? 'bg-sky-900/75 text-white' : 'bg-foreground/10'}
                    relative flex cursor-pointer rounded-lg px-16 py-2 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    {checked && (
                      <div className='absolute left-1 top-2.5 translate-x-1/2 text-white'>
                        <CheckIcon className='h-4 w-4' />
                      </div>
                    )}
                    <div className='flex items-center'>
                      <div className='text-sm'>
                        <RadioGroup.Label as='p' className='text-foreground'>
                          {option.name}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
