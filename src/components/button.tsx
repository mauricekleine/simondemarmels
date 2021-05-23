import classnames from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isActive?: boolean;
  isLoading?: boolean;
  onClick: () => void;
};

const Button = ({ children, isActive, isLoading, onClick }: Props) => (
  <button
    className={classnames(
      "px-4 py-2 bg-gray-100 border border-gray-400 rounded hover:bg-gray-200 focus:outline-none",
      {
        "animate-pulse cursor-default": isLoading,
        "bg-gray-600 hover:bg-gray-600 text-white": isActive,
      }
    )}
    disabled={isLoading}
    onClick={onClick}
  >
    {isLoading ? <span>Loading...</span> : children}
  </button>
);

export default Button;
