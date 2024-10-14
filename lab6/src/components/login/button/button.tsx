import React from "react";

interface ButtonProps {
    className?: string;
    type?: "button" | "submit" | "reset";
    text: string;
}

const Button: React.FC<ButtonProps> = ({ className, type = "button", text }) => {
    return (
        <button className={className} type={type}>
            {text}
        </button>
    );
};

export default Button;
