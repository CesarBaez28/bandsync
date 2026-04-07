'use client';

import clsx from 'clsx'
import { HTMLAttributes, ReactNode } from 'react'
import style from './header.module.css';

type HeaderProps = HTMLAttributes<HTMLElement> & {
  readonly className?: string,
  readonly children: ReactNode
}

export default function Header ({className, children, ...props} : HeaderProps) {
  const headerClassName = clsx (
    style.header,
    className
  );

  return (
    <header className={headerClassName} {...props}>
      {children}
    </header>
  )
}
