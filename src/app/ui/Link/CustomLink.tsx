'use client';

import Link, { LinkProps } from 'next/link';
import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './custom-link.module.css';

type CustomLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  style?: CSSProperties;
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
  buttonStyle?: boolean;
};

export default function CustomLink({
  href,
  children,
  className,
  iconLeft,
  iconRight,
  style,
  variant = 'primary',
  fullWidth = false,
  buttonStyle = false,
  ...props
}: CustomLinkProps) {
  const linkClassName = clsx(
    styles.link,
    styles[variant],
    {
      [styles.fullWidth]: fullWidth,
      [styles.buttonStyle]: buttonStyle,
    },
    className
  );

  return (
    <Link href={href} className={linkClassName} style={style} {...props}>
      {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </Link>
  );
}
