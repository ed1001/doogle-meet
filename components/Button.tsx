type Props = {
  text: string;
  rounded?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = (props) => {
  const { text, rounded } = props;

  return (
    <button
      {...props}
      className={`relative ${rounded ? "rounded-full" : "rounded-md"} w-fit text-xs p-4 text-white
      bg-highlight drop-shadow`}
    >
      {text}
      <div className="absolute top-0 left-0 w-full h-full rounded-full opacity-5 hover:bg-black" />
    </button>
  );
};
