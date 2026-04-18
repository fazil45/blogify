type Input = {
  htmlFor: string;
  type: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  value?: string;
  label: string;
};

const Input = ({
  htmlFor,
  type,
  placeholder,
  onChange,
  onBlur,
  value,
  label,
}: Input) => {
  return (
    <div>
      <div className="flex flex-col ">
        <label
          htmlFor={htmlFor}
          className="text-lg font-medium  text-(--text-light) dark:text-(--text-dark)"
        >
          {label}
        </label>
        <input
          className="bg-white dark:bg-neutral-600 rounded-sm outline-none shadow-2xs py-1 px-2 placeholder:textneutral-500 dark:placeholder:text-neutral-400"
          type={type}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
};

export default Input;
