type Props = {
  text: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = (props) => {
  const { text } = props;

  return (
    <button
      {...props}
      className={
        "relative rounded-full w-fit text-xs p-4 text-white bg-blue-600 drop-shadow"
      }
    >
      {text}
      <div className="absolute top-0 left-0 w-full h-full rounded-full opacity-5 hover:bg-black" />
    </button>
  );
};
