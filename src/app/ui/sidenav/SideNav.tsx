'use client';

import { ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useSideNav } from './SideNavContext';
import Image from 'next/image';
import CustomButton from '../button/CustomButton';
import CustomLink from '../link/CustomLink';
import styles from './sidenav.module.css';
import { UserPermissions } from '@/app/lib/permisions';
import { usePermissions } from '@/app/lib/customHooks/usePermissions';
import { UUID } from 'node:crypto';

type NavItem = {
  label: string;
  href?: string;
  icon?: ReactNode
  subItems?: { label: string; href: string; icon?: ReactNode; permission?: string; }[];
  permission?: string;
};

const MOBILE_BREAKPOINT = 768;

export default function SideNav({ hypName, musicalBandId }: { readonly hypName: string; readonly musicalBandId: UUID }) {
  const { hasPermission } = usePermissions();
  const { isCollapsed, setCollapsed, mounted } = useSideNav();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);


  const navItems: NavItem[] = [
    { label: 'Menú principal', href: `/musicalbands/${hypName}`, icon: <Image src="/home_24dp.svg" alt="Menú principal" width={24} height={24} /> },
    {
      label: 'Integrantes',
      href: `/musicalbands/${hypName}/users`,
      icon: <Image src="/group_24dp.svg" alt="Integrantes" width={24} height={24} />,
      permission: UserPermissions.VIEW_MEMBERS
    },
    {
      label: 'Repertorios', icon: <Image src="/library_music_24dp.svg" alt="Repertorios" width={24} height={24} />,
      subItems: [
        { label: 'Ver repertorios', href: `/musicalbands/${hypName}/repertoires`, icon: <Image src="/document_search_24dp.svg" alt="Ver repertorios" width={24} height={24} /> },
        { label: 'Registrar repertorio', href: `/musicalbands/${hypName}/repertoires/create`, icon: <Image src="/add_24dp.svg" alt="Registrar repertorio" width={24} height={24} />, permission: UserPermissions.ADD_REPERTOIRE },
        { label: 'Exportar', href: `/musicalbands/${hypName}/repertoires/export`, icon: <Image src="/file_export_24dp.svg" alt="Exportar repertorio" width={24} height={24} /> },
      ]
    },
    {
      label: 'Canciones', icon: <Image src="/audio_file_24dp.svg" alt="Canciones" width={24} height={24} />,
      subItems: [
        { label: 'Ver canciones', href: `/musicalbands/${hypName}/songs`, icon: <Image src="/document_search_24dp.svg" alt="Ver canciones" width={24} height={24} /> },
        { label: 'Registrar canción', href: `/musicalbands/${hypName}/songs/create`, icon: <Image src="/add_24dp.svg" alt="Registrar canción" width={24} height={24} />, permission: UserPermissions.ADD_SONG },
        { label: 'Artistas', href: `/musicalbands/${hypName}/artists`, icon: <Image src="/artist_24dp.svg" alt="Artistas" width={24} height={24} /> },
        { label: 'Géneros', href: `/musicalbands/${hypName}/genres`, icon: <Image src="/genres_24dp.svg" alt="Géneros Musicales" width={24} height={24} /> },
      ]
    },
    { label: 'Roles Musicales', href: `/musicalbands/${hypName}/musical-roles`, icon: <Image src="/adaptive_audio_mic_24dp.svg" alt="Roles musicales" height={24} width={24} /> },
    { label: 'Calendario', href: `/musicalbands/${hypName}/calendar`, icon: <Image src="/calendar_month_24dp.svg" alt="Calendario" width={24} height={24} /> },
    {
      label: 'Configuración', icon: <Image src="/settings_24dp.svg" alt="Configuración" width={24} height={24} />,
      subItems: [
        { label: 'Banda', href: `/musicalbands/${hypName}/settings`, icon: <Image src="/music_note_24dp.svg" alt="Configuración banda" width={24} height={24} /> },
        { label: 'Roles y permisos', href: `/musicalbands/${hypName}/roles-and-permissions`, icon: <Image src="/admin_panel_settings_24dp.svg" alt="Configuración" width={24} height={24} />, permission: UserPermissions.VIEW_ROLES_AND_PERMISSIONS },
      ]
    },
  ];

  if (!mounted) return null;

  return <>
    <AnimatePresence>
      {isMobile && !isCollapsed && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setCollapsed(true)}
        />
      )}
    </AnimatePresence>

    <motion.nav
      className={clsx(styles.sideNav, {
        [styles.collapsed]: isCollapsed && !isMobile,
        [styles.open]: !isCollapsed
      })}
      animate={mounted ? { width: isCollapsed ? 0 : 240 } : false}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {!isCollapsed && (
        <motion.ul
          className={styles.navList}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {navItems.map((item) => {
            const isActive = item.href === pathname;
            const icon = item.icon;

            const hasItemPermission = item.permission ? hasPermission(item.permission, musicalBandId) : true;

            if (!hasItemPermission) return null;

            return (
              <li key={item.label} className={styles.navItem}>
                {item.subItems ? (
                  <>
                    <CustomButton
                      style={{ justifyContent: 'space-between', textAlign: 'left' }}
                      variant='tertiary'
                      fullWidth
                      type="button"
                      onClick={() => toggleMenu(item.label)}
                      aria-expanded={openMenus[item.label] ?? false}
                    >
                      <span className={styles.navButtonContainer}>
                        {icon ?? icon}
                        {item.label}
                      </span>
                      <span className={styles.chevronIcon}>
                        {openMenus[item.label]
                          ? <Image src="/keyboard_arrow_down_24dp.svg" alt="arrow down" width={24} height={24} />
                          : <Image src="/keyboard_arrow_right_24dp.svg" alt="arrow right" width={24} height={24} />
                        }
                      </span>
                    </CustomButton>

                    {openMenus[item.label] && (
                      <ul className={styles.subNavList}>
                        {item.subItems.map((subItem) => {

                          const hasSubItemPermission = subItem.permission ? hasPermission(subItem.permission, musicalBandId) : true;

                          if (!hasSubItemPermission) return null;

                          const subIcon = subItem.icon;

                          const isSubActive = subItem.href === pathname;
                          return (
                            <li key={subItem.label} className={styles.subNavItem}>
                              <CustomLink
                                style={{ textDecoration: 'none', fontSize: '0.9rem' }}
                                variant='tertiary'
                                href={subItem.href}
                                className={clsx({ [styles.activeLink]: isSubActive })}
                              >
                                <span className={styles.navButtonContainer}>
                                  {subIcon ?? subIcon}
                                  {subItem.label}
                                </span>
                              </CustomLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <CustomLink
                    style={{ textDecoration: 'none', fontSize: '0.9rem' }}
                    variant='tertiary'
                    href={item.href!}
                    className={clsx({ [styles.activeLink]: isActive })}
                  >
                    <span className={styles.navButtonContainer}>
                      {icon ?? icon}
                      {item.label}
                    </span>
                  </CustomLink>
                )}
              </li>
            );
          })}
        </motion.ul>
      )}
    </motion.nav>
  </>;
}
