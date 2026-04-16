"use client";

import { motion } from "motion/react";

type ButtonProps = {
  type?: "submit" | "reset" | "button";
  children: string;
  onClick?: () => void;
  size: "md" | "lg";
};

const Button = ({ type = "button", children, onClick, size }: ButtonProps) => {
  const sizeStyles = {
    md: "px-4 py-1 text-lg",
    lg: "px-24 py-2 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{
        scale: 1.06,
        y: -2,
      }}
      className={`
        relative overflow-hidden rounded-md 
        flex items-center justify-center
        cursor-pointer
        transition-all duration-200 font-semibold
        bg-neutral-800 text-(--text-dark)  border-(--text-dark) dark:bg-(--bg-light) dark:text-(--text-light) border-2 dark:border-(--text-light)
        ${sizeStyles[size]}
      `}
    >
      <span className="flex items-center justify-center relative z-10 tracking-wide">
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
