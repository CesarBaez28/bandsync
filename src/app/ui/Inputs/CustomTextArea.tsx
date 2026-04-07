import { forwardRef, TextareaHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";
import styles from "./customs-inputs.module.css";

type InputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  error?: FieldError;
};

const CustomTextArea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ label, name, error, className, ...rest }, ref) => {
    return (
      <div className={styles["field"]}>
        <label
          htmlFor={name}
        >
          {label}
        </label>
        <textarea
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

CustomTextArea.displayName = "CustomTextArea";
export default CustomTextArea;