import styles from './footer.module.css';

export function Footer() {
  return (
    <footer className={styles['footer']}>
      <div className={styles['footer-container']}>
        <p>© 2025 BandSync. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}