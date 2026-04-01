import HomeHeader from "../ui/header/HomeHeader";
import ResetPasswordForm from "../ui/reset-password/ResetPasswordForm";
import styles from '@/app/reset-password/reset-password.module.css'

type Props = {
  readonly searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage(props: Props) {
  const { token } = (await props.searchParams) ?? {};

  return <>
    <HomeHeader dropDownOptions={[
      { label: 'Iniciar sesión', href: '/login' },
    ]} />
    <main className={styles.main}>
      <h2>Restablecer contraseña</h2>
      <ResetPasswordForm token={token ?? ''} />
    </main>
  </>
}