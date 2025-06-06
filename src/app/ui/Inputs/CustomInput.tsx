"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";
import styles from "./customs-inputs.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: FieldError;
};

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, className, ...rest }, ref) => {
    return (
      <div className={styles["field"]}>
        <label
          htmlFor={name}
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          ref={ref}
          aria-invalid={!!error}
          className={clsx(
            error
              ? styles["field-error"]
              : "",
            className
          )}
          {...rest}
        />
        {error && (
          <p className={styles["error-message"]} role="alert">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
export default CustomInput;
