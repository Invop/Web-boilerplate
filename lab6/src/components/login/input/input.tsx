import React, { ChangeEvent } from "react";

interface InputProps {
    type?: string;
    text: string;
    placeholder?: string;
    label?: string;
    handleChangeText: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type = "text", text, placeholder, label, handleChangeText }) => {
    return (
        <div>
            {label && <label>{label}</label>}
            <input
                type={type}
                value={text}
                placeholder={placeholder}
                onChange={handleChangeText}
                required
            />
        </div>
    );
};

export default Input;
