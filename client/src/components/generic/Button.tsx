import React, { PropsWithChildren } from 'react';

type ButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "submit" | "reset" | "button" | undefined;
};

export default function Button(props: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className="mx-4 my-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
