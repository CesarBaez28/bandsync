import styles from '../styles/login-regiser.module.css'
import RegisterForm from '../ui/register/RegisterForm';

export default function RegisterPage() {
  return (
    <main className={styles['main']}>
      <div className={styles['main-content']}>
        <div className={styles['login-container']}>
          <RegisterForm />
        </div>
      </div>
      <footer className={styles['footer']}>
        <div className={styles['footer-container']}>
          <p>© 2025 BandSync. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
