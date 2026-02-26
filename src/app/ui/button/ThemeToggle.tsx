'use client';

import { useTheme } from '@/app/lib/customHooks/useThem';
import CustomButton from './CustomButton';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <CustomButton style={{padding: "0.4rem"}} onClick={toggleTheme}>
      {theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
    </CustomButton>
  );
}
