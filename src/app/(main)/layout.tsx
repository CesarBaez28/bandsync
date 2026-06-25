import { Footer } from "../ui/footer/Footer";
import styles from './layout.module.css';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}