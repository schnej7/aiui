import React, { PropsWithChildren } from 'react';

type AlignedRowProps = {
  justifyContent?: "around" | "end" | "start" | "between";
};

export default function Button(props: PropsWithChildren<AlignedRowProps>) {

  const justifyContent = props.justifyContent || "around";

  return (
    <div className={`flex items-center justify-${justifyContent}`}>
      {props.children}
    </div>
  );
}
