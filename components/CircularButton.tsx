import { ReactNode } from "react";

type Props = {
  size: "sm" | "lg";
  fill?: boolean;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CircularButton: React.FC<Props> = (props) => {
  const { children, fill, ...rest } = props;

  return (
    <button
      className={`relative flex items-center justify-center w-14 h-14 rounded-full ${fill ? "bg-red-600" : "border border-white"}`}
      {...rest}
    >
      {children}
      <div
        className={`absolute top-0 left-0 w-full h-full rounded-full opacity-0 ${fill ? "bg-black" : "bg-current"} hover:opacity-30 transition-opacity`}
      />
    </button>
  );
};
