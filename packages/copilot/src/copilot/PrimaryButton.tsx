export const PrimaryButton = ({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: string;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-red text-pearl hover:bg-red1 w-auto
    space-x-2 rounded-lg px-8  py-2 font-normal normal-case shadow transition-all duration-300 hover:shadow-md 
    ${className ? className : "ml-4"}`}
    >
      {children}
    </button>
  );
};
