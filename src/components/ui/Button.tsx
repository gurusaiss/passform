import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 select-none shadow-sm";

    const sizeStyles = {
      sm: "h-10 px-4 text-xs tracking-wide",
      md: "h-12 px-6 text-sm md:text-base",
      lg: "h-14 px-8 text-base md:text-lg",
    };

    const variantStyles = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 focus-visible:ring-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600",
      secondary:
        "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 focus-visible:ring-slate-900 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900",
      outline:
        "border-2 border-slate-300 hover:border-slate-400 bg-transparent text-slate-800 hover:bg-slate-50 focus-visible:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
      whatsapp:
        "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-emerald-500/30 focus-visible:ring-[#25D366]",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 focus-visible:ring-red-600",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
