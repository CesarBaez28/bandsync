'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import CustomButton from '../button/CustomButton';
import styles from './user-menu.module.css';
import CustomLink from '../link/CustomLink';

export type DropdownOption = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  action?: () => void | Promise<void>;
  isFormAction?: boolean; // para server actions
};

interface DropdownMenuProps {
  trigger: ReactNode;
  options: DropdownOption[];
  menuWidth?: string;
}

export default function DropdownMenu({ trigger, options, menuWidth = '150px' }: Readonly<DropdownMenuProps>) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function renderMenuOption(option: DropdownOption) {
    if (option.href) {
      return (
        <CustomLink iconLeft={option.icon} style={{ textDecoration: 'none', fontSize: '0.9rem' }} href={option.href} variant='tertiary'>
          {option.label}
        </CustomLink>
      );
    }
    if (option.isFormAction && option.action) {
      return (
        <form action={option.action}>
          <CustomButton iconLeft={option.icon} type='submit' variant='tertiary' style={{ fontSize: '0.9rem' }}>
            {option.label}
          </CustomButton>
        </form>
      );
    }
    return (
      <CustomButton iconLeft={option.icon} onClick={option.action} variant='tertiary' style={{ fontSize: '0.9rem' }}>
        {option.label}
      </CustomButton>
    );
  }

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
      </div>

      {open && (
        <div style={{ width: menuWidth }} className={styles['menu-container']}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {options.map((option) => (
              <li key={option.label} className={styles['option']}>
                {renderMenuOption(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}