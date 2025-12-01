"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";
import styles from "./customs-inputs.module.css";

export type OptionInputSelect = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder?: string;
  label?: string;
  fullWidth?: boolean;
  name: string;
  options: OptionInputSelect[] | undefined;
  error?: FieldError;
};

const CustomSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, name, options, error, className, fullWidth = false, placeholder, ...rest }, ref) => {
    return (
      <div className={clsx(
        styles["field"],
        { [styles.fullWidth]: fullWidth }
      )}
      >
        {label && (
          <label htmlFor={name} className={styles["label"]}>
            {label}
          </label>
        )}
        <select
          id={name}
          name={name}
          ref={ref}
          aria-invalid={!!error}
          className={clsx(
            styles.select,
            error ? styles["field-error"] : "",
            className
          )}
          {...rest}
        >
          <option value="">{placeholder ?? "Seleccione una opción"}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className={styles["error-message"]} role="alert">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";
export default CustomSelect;
