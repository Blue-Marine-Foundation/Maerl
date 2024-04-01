'use client';

import { useState, useEffect } from 'react';

interface ControlledTextareaProps {
  label: string;
  placeholder: string;
  initialValue: string;
  isRequired?: boolean;
  onChange: (value: string) => void;
}

export default function ControlledTextarea({
  label,
  placeholder,
  initialValue,
  isRequired,
  onChange,
}: ControlledTextareaProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className='flex justify-start items-start gap-8 text-sm'>
      <label className='block basis-1/5 pt-2 text-foreground/80'>{label}</label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        required={isRequired}
        rows={3}
        className='basis-4/5 p-2 rounded-md bg-foreground/10 text-foreground shadow-md'
      />
    </div>
  );
}
