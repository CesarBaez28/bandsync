import styles from './StepBlock.module.css';
import React from 'react';

export type StepBlockProps = {
  readonly current: number;
  readonly step: number;
  readonly label: string;
  readonly children: React.ReactNode;
  readonly showLine?: boolean;
  readonly className?: string;
}

export function StepBlock({ 
  current, 
  step, 
  label, 
  children, 
  showLine = true,
  className 
}: StepBlockProps) {

  const isActive = current === step;
  const isCompleted = current > step;

  let circleStatusClass = styles.circleInactive;
  if (isCompleted) {
    circleStatusClass = styles.circleCompleted;
  } else if (isActive) {
    circleStatusClass = styles.circleActive;
  }

  const circleClass = `
    ${styles.circle}
    ${circleStatusClass}
  `;

  return (
    <div className={`${styles.stepBlock} ${className || ''}`}>

      {/* Timeline */}
      <div className={styles.timeline}>

        <div className={circleClass}>
          {isCompleted ? '✓' : step}
        </div>

        {showLine && <div className={styles.line} />}

      </div>

      {/* Content */}
      <div className={styles.content}>

        <div className={`${styles.title} ${isActive ? styles.titleActive : ''}`}>
          Paso {step}: {label}
        </div>

        {isActive && (
          <div className={styles.innerContent}>
            {children}
          </div>
        )}

      </div>
    </div>
  );
}
