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
        <div className="flex flex-col">
          <label
            htmlFor={htmlFor}
            className="text-lg font-medium text-(--text-light) dark:text-(--text-dark)"
          >
            {label}
          </label>

          <input
            id={htmlFor}
            className="bg-white dark:bg-neutral-600 rounded-sm outline-none shadow-2xs py-1 px-2 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
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