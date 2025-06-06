import LoginForm from "../ui/login/LoginForm";
import styles from "./login.module.css";
 
export default function Login() {
  return (
    <main className={styles['main']}>
      <div className={styles['main-content']}>
        <div className={styles['login-container']}>
          <LoginForm />
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