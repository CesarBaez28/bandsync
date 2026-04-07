'use client';

import CustomButton from "../button/CustomButton";
import DropdownMenu from "../dropdown/DropdownMenu";
import Header from "../header/Header";
import { useSideNav } from "../sidenav/SideNavContext";
import { signOutAction } from "@/app/lib/actions/auth";
import ThemeToggle from "../button/ThemeToggle";
import MenuIcon from '@/public/menu_24dp.svg'
import PersonIcon from '@/public/person_24dp.svg'

export default function MainHeader({ hypName, appName }: { readonly hypName: string, readonly appName: string }) {
  const { toggleSideNav } = useSideNav();

  return (
    <Header>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <CustomButton onClick={toggleSideNav} variant="tertiary">
          <MenuIcon width={24} height={24} />
        </CustomButton>
        <h2>{appName}</h2>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.6rem'}}>
        <ThemeToggle />
        <DropdownMenu
          trigger={
            <CustomButton variant="secondary" style={{ padding: '0.4rem' }}>
              <PersonIcon width={24} height={24} />
            </CustomButton>
          }
          options={[
            { label: 'Inicio', href: '/' },
            { label: 'Menú principal', href: `/musicalbands/${hypName}` },
            { label: 'Ver perfil', href: `/musicalbands/${hypName}/profile` },
            { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
          ]}
        />
      </div>
    </Header>
  );
}