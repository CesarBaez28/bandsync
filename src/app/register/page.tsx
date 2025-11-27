import styles from '../styles/login-regiser.module.css'
import { Footer } from '../ui/footer/Footer';
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
      <Footer />
    </main>
  );
}
