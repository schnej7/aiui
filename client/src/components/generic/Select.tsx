import React from 'react';

type Option = {
  value: string;
  name: string;
};

type SelectProps = {
  options: Option[];
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function Select(props: SelectProps) {
  return (
    <select
      className="mx-4 my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      value={props.value}
      onChange={props.onChange}
    >
      {
        props.options.map((option) => (
          <option value={option.value}>
            {option.name}
          </option>
        ))
      }
    </select>
  );
}
