import type { ReactNode } from "react";

export interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="fs-field">
      <span className="fs-field__label">{label}</span>
      {children}
      {hint ? <span className="fs-field__hint">{hint}</span> : null}
    </label>
  );
}
