'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from  './customButton.module.css'
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function CustomButton({
  children,
  iconLeft,
  iconRight,
  isLoading = false,
  disabled,
  variant = 'primary',
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const finalClassName = clsx(
    styles.button,
    styles[variant],
    {
      [styles.fullWidth]: fullWidth,
      [styles.disabled]: isDisabled,
    },
    className,
  );

  return (
    <button className={finalClassName} disabled={isDisabled} {...props}>
      {isLoading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {!isLoading && iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  );
}
