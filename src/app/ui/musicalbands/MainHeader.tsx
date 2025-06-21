'use client';

import Image from "next/image";
import CustomButton from "../button/CustomButton";
import DropdownMenu from "../dropdown/DropdownMenu";
import Header from "../header/Header";
import { useSideNav } from "../sidenav/SideNavContext";
import { signOutAction } from "@/app/lib/actions/auth";

export default function MainHeader({ hypName }: { readonly hypName: string }) {
  const { toggleSideNav } = useSideNav();

  return (
    <Header>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <CustomButton onClick={toggleSideNav} variant="tertiary">
          <Image src="/menu_24dp.svg" alt="perfil" width={24} height={24} />
        </CustomButton>
        <h2>BandSync</h2>
      </div>
      <div>
        <DropdownMenu
          trigger={
            <CustomButton variant="secondary" style={{ padding: '0.4rem' }}>
              <Image src="/person_24dp.svg" alt="perfil" width={24} height={24} />
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