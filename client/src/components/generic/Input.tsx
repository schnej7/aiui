import React, { PropsWithChildren } from 'react';

type InputProps = {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
};

export default function Input(props: PropsWithChildren<InputProps>) {
  return (
    <input
      className="mx-4 my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      value={props.value}
      onChange={props.onChange}
      required={props.required}
      placeholder={props.placeholder}
      type={props.type}
    />
  );
}
