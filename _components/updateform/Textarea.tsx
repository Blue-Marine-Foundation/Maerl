'use client';

import { useState } from 'react';

interface ControlledTextareaProps {
  label: string;
  placeholder: string;
  isRequired?: boolean;
  onChange: (value: string) => void;
}

export default function ControlledTextarea({
  label,
  placeholder,
  isRequired,
  onChange,
}: ControlledTextareaProps) {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <label className='block mb-2 pl-1 text-sm text-foreground/80'>
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        required={isRequired}
        rows={3}
        className='w-full p-2 rounded-md bg-foreground/10 text-foreground shadow-md'
      />
    </div>
  );
}
