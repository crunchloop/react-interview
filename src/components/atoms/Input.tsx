import { ChangeEvent, KeyboardEvent } from "react";

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyPress,
  className = "",
  disabled = false,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyPress}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      disabled={disabled}
    />
  );
}
