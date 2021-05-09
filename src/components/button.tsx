import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

const Button = ({ children, onClick }: Props) => (
  <button
    className="px-4 py-2 my-4 bg-gray-100 border border-gray-400 rounded hover:bg-gray-200"
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
