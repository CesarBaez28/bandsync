import styles from '@/ui/card/card.module.css'

export default function Card({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className={styles.card + ' col-12 col-sm-10 col-md-8 col-lg-6'}>
      {children}
    </div>
  );
}