import CustomLink from '../link/CustomLink';
import styles from './footer.module.css';
import { config } from '@/app/lib/config';

const currentYear = new Date().getFullYear();

type Props = {
  readonly hypName?: string
}

export function Footer({ hypName }: Props) {
  return (
    <footer className={styles['footer']}>
      <div className={styles['footer-container']}>
        <p>
          <span>
            © {currentYear} {config.appName}. Todos los derechos reservados.
          </span>
          <span style={{ marginLeft: '1rem', marginRight: '1rem' }}>
            <CustomLink href={hypName ? `/musicalbands/${hypName}/terms-of-service` : '/terms-of-service'} variant='tertiary'>
              Condiciones de uso
            </CustomLink>
            &nbsp; | &nbsp;
            <CustomLink href={hypName ? `/musicalbands/${hypName}/privacy-policy` : '/privacy-policy'} variant='tertiary'>
              Políticas de privacidad
            </CustomLink>
          </span>
        </p>
      </div>
    </footer>
  )
}