import styles from '@/ui/card/card.module.css'

export default function Card({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className={styles.card + ' col-12 col-sm-8 col-md-6 col-lg-5'}>
      {children}
    </div>
  );
}