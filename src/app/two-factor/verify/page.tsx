import TwoFactorForm from "@/app/ui/two-factor/TwoFactorForm";
import styles from '@/app/two-factor/verify/verify.module.css'
import { Footer } from "@/app/ui/footer/Footer";

type Props = {
  readonly searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function TwoFactorVerifyPage(props: Props) {
  const { token } = (await props.searchParams) ?? {};

  return (
    <main className={styles.main}>
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {token == undefined ? (
            <p>Token no valido</p>
          ) : < TwoFactorForm tempToken={token} />
          }
        </div>
      </div>
      <Footer />
    </main>
  )
}