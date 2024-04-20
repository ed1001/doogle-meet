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
      className="flex w-16 cursor-pointer items-center justify-between rounded-full bg-secondaryHighlight
        pl-2"
    >
      <ChevronDown />
      {children}
    </div>
  );
};
