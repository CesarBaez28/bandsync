import styles from './footer.module.css';
import { config } from '@/app/lib/config';

export function Footer() {
  return (
    <footer className={styles['footer']}>
      <div className={styles['footer-container']}>
        <p>© {new Date().getFullYear()} {config.appName}. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}