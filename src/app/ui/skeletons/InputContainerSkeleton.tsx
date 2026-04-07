import CustomButton from "../button/CustomButton";
import skeletonBaseStyles from './skeleton.module.css';
import styles from './input-container-skeleton.module.css';

export default function InputContainerSkeleton() {
  return (
    <div className={`${styles.searchInputContainer} col-12 col-sm-8 col-md-6 col-lg-6`}>
      <input className={`${skeletonBaseStyles.skeleton} ${styles.searchInput}`} type="search" name="" id="" />
      <CustomButton className={`${skeletonBaseStyles.skeleton}`}>
        <div style={{width: '50px'}} className={skeletonBaseStyles.skeleton}></div>
      </CustomButton>
    </div>
  )
}
