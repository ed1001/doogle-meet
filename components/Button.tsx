type Props = {
  text: string;
  rounded?: boolean;
  outlined?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = (props) => {
  const { text, outlined } = props;

  return (
    <button
      {...props}
      className={`relative w-fit rounded-md border border-highlight ${outlined ? "" : "bg-highlight"} p-4
      text-xs text-white drop-shadow`}
    >
      {text}
      <div
        className={`absolute left-0 top-0 size-full rounded-md opacity-5 hover:bg-black`}
      />
    </button>
  );
};
