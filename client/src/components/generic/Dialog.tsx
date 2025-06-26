import React, { PropsWithChildren } from 'react';

type DialogProps = {
};

export default function Dialog(props: PropsWithChildren<DialogProps>) {
  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-700/50">
      <div className="relative p-4 w-full max-w-2xl max-h-full m-auto mt-8">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 py-4 px-6">
          {props.children}
        </div>
      </div>
    </div>
  );
}
