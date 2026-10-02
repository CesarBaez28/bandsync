import Image from 'next/image';
import clsx from 'clsx';
import styles from './brand-logo.module.css';

type Props = {
  readonly alt?: string;
  readonly size?: 'header' | 'form';
};

export default function BrandLogo({ alt = 'CebaMusic', size = 'header' }: Props) {
  const isForm = size === 'form';

  const lightLogo = isForm
    ? '/CebaMusic_logo_white.png'
    : '/CebaMusic_logo_horizontally_white.png';

  const darkLogo = isForm
    ? '/CebaMusic_logo_dark.png'
    : '/CebaMusic_logo_Horizontally_dark.png';

  return (
    <span className={clsx(styles.frame, size === 'form' && styles.formFrame)}>
      <Image
        className={`${styles.canvas} ${styles.light}`}
        src={lightLogo}
        alt={alt}
        width={320}
        height={320}
        loading="eager"
      />
      <Image
        className={`${styles.canvas} ${styles.dark}`}
        src={darkLogo}
        alt={alt}
        width={320}
        height={320}
        loading="eager"
      />
    </span>
  );
}