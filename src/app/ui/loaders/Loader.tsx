import styles from './loader.module.css';

interface LoaderProps {
	readonly size?: 'sm' | 'md' | 'lg';
}

export default function Loader({ size = 'md' }: LoaderProps) {
	return (
		<div className={`${styles.loader} ${styles[size]}`} aria-busy />
	);
}
