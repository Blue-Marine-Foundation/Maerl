'use client';

import { useState, useEffect } from 'react';

interface ControlledInputProps {
  type: string;
  initialValue: string | number | undefined;
  label: string;
  placeholder: string;
  isRequired?: boolean;
  unit?: string | undefined;
  onChange: (value: string) => void;
}

export default function ControlledTextInput({
  type,
  initialValue,
  label,
  placeholder,
  isRequired,
  unit,
  onChange,
}: ControlledInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className='flex justify-start items-center gap-8 text-sm'>
      <label className='block basis-1/5 pl-1 text-sm text-foreground/80'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        required={isRequired}
        className={`basis-4/5 p-2 rounded-md bg-foreground/10 text-foreground shadow-md ${
          type === 'number'
            ? 'max-w-[200px] -ml-2 text-right pr-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            : ''
        } ${type === 'date' ? 'max-w-[200px] -ml-2' : ''}`}
      />
      {unit && <p className='-ml-4 text-foreground/80'>{unit}</p>}
    </div>
  );
}
