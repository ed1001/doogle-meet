import { ChevronDown } from "@/icons/ChevronDown";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CircleDropdownBG: React.FC<Props> = (props) => {
  const { children, onClick } = props;

  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center pl-2 w-16 bg-secondaryHighlight rounded-full
        cursor-pointer"
    >
      <ChevronDown />
      {children}
    </div>
  );
};
