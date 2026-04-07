'use client';

import { useTheme } from '@/app/lib/customHooks/useThem';
import CustomButton from './CustomButton';
import MoonIcon from '@/public/nightlight_24dp.svg';
import SunIcon from '@/public/brightness_7_24dp.svg';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <CustomButton style={{padding: "0.4rem"}} onClick={toggleTheme}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </CustomButton>
    );
  }
