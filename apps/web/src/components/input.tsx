import { forwardRef } from "react";

type InputProps = {
  htmlFor: string;
  type: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  value?: string;
  label: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      htmlFor,
      type,
      placeholder,
      onChange,
      onBlur,
      value,
      label,
    },
    ref
  ) => {
    return (
      <div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor={htmlFor}
            className="sm:text-sm xl:text-lg font-medium text-(--text-light) dark:text-(--text-dark)"
          >
            {label}
          </label>

          <input
            id={htmlFor}
            className="bg-white dark:bg-neutral-600 rounded-sm outline-none shadow-2xs sm:px-1 sm:py-px xl:py-1 xl:px-2 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 sm:placeholder:text-sm placeholder:text-lg"
            type={type}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            value={value}
            ref={ref}  
          />
        </div>
      </div>
    );
  }
);

export default Input;