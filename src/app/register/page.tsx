import styles from '../styles/login-regiser.module.css'
import RegisterForm from '../ui/register/RegisterForm';

type Props = {
  readonly searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function RegisterPage(props: Props) {
  const { token } = (await props.searchParams) ?? {};

  return (
    <main className={styles['main']}>
      <div className={styles['main-content']}>
        <div className={styles['login-container']}>
          <RegisterForm token={token} />
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
