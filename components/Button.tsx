type Props = {
  text: string;
  rounded?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = (props) => {
  const { text, rounded } = props;

  return (
    <button
      {...props}
      className={`relative ${rounded ? "rounded-full" : "rounded-md"} w-fit bg-highlight p-4 text-xs
      text-white drop-shadow`}
    >
      {text}
      <div className="absolute left-0 top-0 size-full rounded-full opacity-5 hover:bg-black" />
    </button>
  );
};
