'use client';

import { useState } from 'react';

interface ControlledInputProps {
  type: string;
  initialValue: string;
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function ControlledTextInput({
  type,
  initialValue,
  label,
  placeholder,
  onChange,
}: ControlledInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className='mb-4'>
      <label className='block mb-2 pl-1 text-sm text-foreground/80'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className='w-full p-2 rounded-md bg-foreground/10 text-foreground'
      />
    </div>
  );
}
