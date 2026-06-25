import styles from './footer.module.css';
import { config } from '@/app/lib/config';

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className={styles['footer']}>
      <div className={styles['footer-container']}>
        <p>© {currentYear} {config.appName}. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}