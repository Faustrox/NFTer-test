import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
};

const Button: React.FC<ButtonProps> = ({ children, disabled, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${
                disabled
                    ? "bg-meta-black-200 text-meta-black-500"
                    : "bg-meta-blue-600 hover:bg-meta-blue-700 active:!bg-meta-blue-800 text-white"
            }  font-semibold duration-200 rounded-lg px-5 py-2 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
