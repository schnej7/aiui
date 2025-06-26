import React, { PropsWithChildren } from 'react';

type TextAreaProps = {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
};

export default function TextArea(props: PropsWithChildren<TextAreaProps>) {
  return (
    <textarea
      className="flex flex-auto resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      value={props.value}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      required={props.required}
      placeholder={props.placeholder}
    />
  );
}
