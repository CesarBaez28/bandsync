import styles from '@/app/ui/Buttons/headerButton.module.css'

export function HeaderButton({ iconPath, label, onClick, className = '', ariaLabel }: Readonly<{
  iconPath: string;
  label?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel: string;  
}>) {
  return (
    <button
      className={`${styles['header-button']} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d={iconPath} />
      </svg>
      {label && <span>{label}</span>}
    </button>
  );
}