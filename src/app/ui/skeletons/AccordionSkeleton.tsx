import styles from './accordion-skeleton.module.css';
import skeletonBaseStyles from './skeleton.module.css';

export default function AccordionSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={`${skeletonBaseStyles.skeleton} ${styles.header}`} />
      <div className={styles.content}>
        <div className={`${skeletonBaseStyles.skeleton} ${styles.line}`} />
        <div className={`${skeletonBaseStyles.skeleton} ${styles.line}`} />
        <div className={`${skeletonBaseStyles.skeleton} ${styles.lineShort}`} />
      </div>
    </div>
  );
}
