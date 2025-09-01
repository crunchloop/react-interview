import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export default function Button({
  onClick,
  disabled = false,
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
}: {
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  className?: string;
}) {
  const baseClasses =
    "rounded-md flex transition-colors items-center disabled:cursor-not-allowed gap-2 font-medium cursor-pointer disabled:bg-gray-300";

  const variantClasses = {
    primary: "bg-sky-500 text-white hover:bg-sky-600",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "text-red-500 hover:text-red-700 hover:bg-red-50",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2",
  };

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon className={iconSizeClasses[size]} />}
      {children}
    </button>
  );
}
