import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white border border-primary/50 hover:border-primary hover:shadow-neon focus:ring-primary",
    secondary: "bg-surface text-white border border-secondary hover:border-secondary hover:shadow-neon-sm focus:ring-secondary",
    danger: "bg-gradient-to-r from-error to-accent text-white border border-error/50 hover:border-error hover:shadow-neon focus:ring-error",
    ghost: "bg-transparent text-gray-300 border border-transparent hover:bg-surface hover:text-white focus:ring-primary",
    success: "bg-gradient-to-r from-success to-primary text-white border border-success/50 hover:border-success hover:shadow-neon focus:ring-success"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;