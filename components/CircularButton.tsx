import { ReactNode } from "react";

import { Size } from "@/types";

type Props = {
  fill?: boolean;
  size: Size;
  active?: boolean;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CircularButton: React.FC<Props> = (props) => {
  const { children, className, size, active, fill, ...rest } = props;

  return (
    <button
      className={`relative flex items-center justify-center ${
        size === "sm" ? "size-10" : "size-14"
      } rounded-full ${fill ? "bg-secondaryHighlight" : ""} ${className}`}
      {...rest}
    >
      {children}
      <div
        className={`absolute top-0 left-0 size-full rounded-full opacity-0 ${
          active ? "bg-current" : "bg-black"
        } hover:opacity-30 transition-opacity`}
      />
    </button>
  );
};
