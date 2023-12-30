'use client';

import { useState } from 'react';

interface ControlledInputProps {
  type: string;
  initialValue: string | number;
  label: string;
  placeholder: string;
  isRequired?: boolean;
  onChange: (value: string) => void;
}

export default function ControlledTextInput({
  type,
  initialValue,
  label,
  placeholder,
  isRequired,
  onChange,
}: ControlledInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <label className='block mb-2 pl-1 text-sm text-foreground/80'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        required={isRequired}
        className={`w-full p-2 rounded-md bg-foreground/10 text-foreground shadow-md ${
          type === 'number'
            ? 'text-right pr-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            : ''
        }`}
      />
    </div>
  );
}
