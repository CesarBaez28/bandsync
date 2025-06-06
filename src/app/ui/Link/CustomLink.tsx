'use client';

import Link, { LinkProps } from 'next/link';
import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './custom-link.module.css';

type CustomLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
};

export default function CustomLink({
  href,
  children,
  className,
  style,
  variant = 'primary',
  fullWidth = false,
  ...props
}: CustomLinkProps) {
  const linkClassName = clsx(
    styles.link,
    styles[variant],
    {
      [styles.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <Link href={href} className={linkClassName} style={style} {...props}>
      {children}
    </Link>
  );
}
