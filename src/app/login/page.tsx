import LoginForm from "../ui/login/LoginForm";
import styles from '../styles/login-regiser.module.css'
import { Footer } from "../ui/footer/Footer";
 
export default function Login() {
  return (
    <main className={styles['main']}>
      <div className={styles['main-content']}>
        <div className={styles['login-container']}>
          <LoginForm />
        </div>
      </div>
      <Footer />
    </main>
  );
}