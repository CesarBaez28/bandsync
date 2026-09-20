"use client";

import styles from './accordion.module.css';
import ArrowDownIcon from '@/public/keyboard_arrow_down_24dp.svg';
import clsx from 'clsx';

type Props = {
  readonly header?: React.ReactNode;
  readonly actions?: React.ReactNode;
  readonly defaultOpen?: boolean;
  readonly children?: React.ReactNode;
  readonly className?: string;
}

export default function Accordion({ header, actions, defaultOpen = false, children, className }: Props) {
  return (
    <details
      className={clsx(styles.accordion, className)}
      open={defaultOpen}
    >
      <summary className={styles.summary}>
        <div className={styles.summaryLeft}>
          {header}
        </div>

        <ArrowDownIcon className={styles.chevron} />
      </summary>

      {children && (
        <div className={styles.content}>
          {children}
        </div>
      )}

      {actions && (
        <div className={styles.actionsContainer}>
          <div className={styles.actions}>
            {actions}
          </div>
        </div>
      )}

    </details>
  );
}
