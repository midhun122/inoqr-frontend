import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className = "", ...rest }: InputProps) {
  return (
    <input
      className={`h-input w-full rounded-md border bg-canvas px-4 text-[14px] text-ink placeholder:text-faint transition-colors duration-fast focus:border-accent focus:outline-none ${
        error ? "border-red-500" : "border-hairline"
      } ${className}`}
      {...rest}
    />
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function Textarea({ error, className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      className={`min-h-[96px] w-full rounded-md border bg-canvas px-4 py-3 text-[14px] text-ink placeholder:text-faint transition-colors duration-fast focus:border-accent focus:outline-none ${
        error ? "border-red-500" : "border-hairline"
      } ${className}`}
      {...rest}
    />
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="field-error">
      {message}
    </p>
  );
}
