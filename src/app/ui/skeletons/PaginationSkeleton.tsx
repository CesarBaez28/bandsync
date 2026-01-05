import styles from './pagination-skeleton.module.css';

type PaginationSkeletonProps = {
  readonly pages?: number;
  readonly showArrows?: boolean;
}

export default function PaginationSkeleton({
  pages = 5,
  showArrows = true,
}: PaginationSkeletonProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Left arrow */}
        {showArrows && <div className={styles.arrowSkeleton} />}

        {/* Page numbers */}
        <div className={styles.paginationNumber}>
          {Array.from({ length: pages }).map((_, index) => (
            <div
              key={index}
              className={`${styles.pageSkeleton} ${index === Math.floor(pages / 2) ? styles.active : ''
                }`}
            />
          ))}
        </div>

        {/* Right arrow */}
        {showArrows && <div className={styles.arrowSkeleton} />}
      </div>
    </div>
  );
}
