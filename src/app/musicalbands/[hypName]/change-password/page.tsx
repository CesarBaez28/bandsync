import { Metadata } from "next";
import ChangePasswordForm from "@/app/ui/change-password/ChangePasswordForm";
import styles from '@/app/musicalbands/[hypName]/change-password/change-password.module.css';

export const metadata: Metadata = {
  title: "Cambiar contraseña",
  description: "Cambiar contraseña",
};

type Props = {
  readonly params: Promise<{ hypName: string; }>;
}

export default async function ChangePasswordPage(props: Props) {
  const { hypName } = await props.params;

  return (
    <div>
      <h2>Cambiar contraseña</h2>
      <main className={styles.mainContainer} style={{ marginTop: '1rem' }}>
        <ChangePasswordForm hypName={hypName} />
      </main>
    </div>
  );
}