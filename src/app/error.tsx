'use client';

import { useEffect } from 'react';
import styles from './error.module.css';
import CustomButton from './ui/button/CustomButton';

interface ErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <main className={styles.container} role="alert">
      <div className={styles.card}>
        <span className={styles.icon}>⚠️</span>

        <h1 className={styles.title}>
          Algo salió mal
        </h1>

        <p className={styles.description}>
          Ocurrió un error inesperado. Puedes intentar recargar la vista o volver más tarde.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <pre className={styles.stack}>
            {error.message}
          </pre>
        )}

        <CustomButton
          onClick={() => reset()}
        >
          Reintentar
        </CustomButton>
      </div>
    </main>
  );
}
