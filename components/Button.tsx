type Props = {
  text: string;
  rounded?: boolean;
  outline?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = (props) => {
  const { text, rounded, outline } = props;

  return (
    <button
      {...props}
      className={`relative ${rounded ? "rounded-full" : "rounded-md"} w-fit border border-highlight ${outline ? "" : "bg-highlight"} p-4
      text-xs text-white drop-shadow`}
    >
      {text}
      <div
        className={`absolute left-0 top-0 size-full ${rounded ? "rounded-full" : "rounded-md"} opacity-5 hover:bg-black`}
      />
    </button>
  );
};
