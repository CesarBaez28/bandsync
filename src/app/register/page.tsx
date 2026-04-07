import styles from '../styles/login-regiser.module.css'
import { Footer } from '../ui/footer/Footer';
import RegisterForm from '../ui/register/RegisterForm';
import { config } from '@/app/lib/config';

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
          <RegisterForm token={token} appName={config.appName} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
