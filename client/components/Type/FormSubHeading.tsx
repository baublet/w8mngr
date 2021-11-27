import React from "react";

export function FormSubHeading({
  children,
  leftIcon,
}: React.PropsWithChildren<{
  leftIcon?: JSX.Element;
}>) {
  return (
    <div className="flex gap-4 items-center">
      {leftIcon && <div>{leftIcon}</div>}
      <h4 className="text-gray-500 font-thing">{children}</h4>
    </div>
  );
}
