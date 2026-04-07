"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";
import styles from "./customs-inputs.module.css";
import CalendarIcon from '@/public/calendar_month_24dp_FILL.svg'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: FieldError;
};

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, className, ...rest }, ref) => {
    return (
      <div className={styles["field"]}>
        <label htmlFor={name}>{label}</label>

        <div className={styles["input-wrapper"]}>
          <input
            id={name}
            name={name}
            ref={ref}
            aria-invalid={!!error}
            className={clsx(
              error ? styles["field-error"] : "",
              className
            )}
            {...rest}
          />

          {rest.type === "date" && (
            <span className={styles["calendar-icon"]}>
              <CalendarIcon width={18} height={18} />
            </span>
          )}
        </div>
        
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
