import { ChevronDown } from "@/icons/ChevronDown";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CircleDropdownBG: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <div className="flex justify-between items-center pl-2 w-16 bg-secondaryHighlight rounded-full">
      <ChevronDown />
      {children}
    </div>
  );
};
