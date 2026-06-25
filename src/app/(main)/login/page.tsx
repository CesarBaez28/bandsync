import LoginForm from "../../ui/login/LoginForm";
import styles from '@/app/styles/login-regiser.module.css';
import { config } from '@/app/lib/config';
import { Suspense } from "react";

export default function Login() {
  return (
    <main className={styles['main']}>
      <div className={styles['main-content']}>
        <div className={styles['login-container']}>
          <Suspense fallback={<div>Cargando...</div>}>
            <LoginForm appName={config.appName} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}