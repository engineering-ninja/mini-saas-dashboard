import { forwardRef } from "react";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, id, className, ...props },
  ref,
) {
  const fieldId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        className={`rounded-lg border px-3 py-2 text-sm text-slate-900 transition outline-none focus:ring-2 focus:ring-slate-400 ${
          error ? "border-red-400" : "border-slate-300"
        } ${className ?? ""}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
});
