'use client';

import { ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useSideNav } from '@/ui/sidenav/SideNavContext';
import CustomButton from '@/ui/button/CustomButton';
import CustomLink from '@/app/ui/link-temporal/CustomLink';
import styles from '@/ui/sidenav/sidenav.module.css';
import { UserPermissions } from '@/app/lib/permisions';
import { usePermissions } from '@/app/lib/customHooks/usePermissions';
import { UUID } from 'node:crypto';
import HomeIcon from '@/public/home_24dp.svg'
import GroupIcon from '@/public/group_24dp.svg'
import LibraryMusicIcon from '@/public/library_music_24dp.svg'
import DocumentSearchIcon from '@/public/document_search_24dp.svg'
import AddIcon from '@/public/add_24dp.svg'
import FileExportIcon from '@/public/file_export_24dp.svg'
import AudioFileIcon from '@/public/audio_file_24dp.svg'
import ArtistIcon from '@/public/artist_24dp.svg'
import GenresIcon from '@/public/genres_24dp.svg'
import AdaptiveAudioMicIcon from '@/public/adaptive_audio_mic_24dp.svg'
import CalendarMonthIcon from '@/public/calendar_month_24dp.svg'
import SettingsIcon from '@/public/settings_24dp.svg'
import MusicNoteIcon from '@/public/music_note_24dp.svg'
import AdminPanelSettingsIcon from '@/public/admin_panel_settings_24dp.svg'
import ArrowDownIcon from '@/public/keyboard_arrow_down_24dp.svg'
import ArrowRightIcon from '@/public/keyboard_arrow_right_24dp.svg'

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
    {
      label: 'Menú principal',
      href: `/musicalbands/${hypName}`,
      icon: <HomeIcon />
    },
    {
      label: 'Integrantes',
      href: `/musicalbands/${hypName}/users`,
      icon: <GroupIcon />,
      permission: UserPermissions.VIEW_MEMBERS
    },
    {
      label: 'Repertorios',
      icon: <LibraryMusicIcon />,
      subItems: [
        {
          label: 'Ver repertorios',
          href: `/musicalbands/${hypName}/repertoires`, icon:
            <DocumentSearchIcon />
        },
        {
          label: 'Registrar repertorio',
          href: `/musicalbands/${hypName}/repertoires/create`,
          icon: <AddIcon />,
          permission: UserPermissions.ADD_REPERTOIRE
        },
        {
          label: 'Exportar',
          href: `/musicalbands/${hypName}/repertoires/export`,
          icon: <FileExportIcon />
        },
      ]
    },
    {
      label: 'Canciones',
      icon: <AudioFileIcon />,
      subItems: [
        {
          label: 'Ver canciones',
          href: `/musicalbands/${hypName}/songs`,
          icon: <DocumentSearchIcon />
        },
        {
          label: 'Registrar canción',
          href: `/musicalbands/${hypName}/songs/create`,
          icon: <AddIcon />,
          permission: UserPermissions.ADD_SONG
        },
        {
          label: 'Artistas',
          href: `/musicalbands/${hypName}/artists`,
          icon: <ArtistIcon />
        },
        {
          label: 'Géneros',
          href: `/musicalbands/${hypName}/genres`,
          icon: <GenresIcon />
        },
      ]
    },
    {
      label: 'Roles Musicales',
      href: `/musicalbands/${hypName}/musical-roles`,
      icon: <AdaptiveAudioMicIcon />
    },
    {
      label: 'Calendario',
      href: `/musicalbands/${hypName}/calendar`,
      icon: <CalendarMonthIcon />
    },
    {
      label: 'Configuración',
      icon: <SettingsIcon />,
      subItems: [
        {
          label: 'Banda',
          href: `/musicalbands/${hypName}/settings`,
          icon: <MusicNoteIcon />
        },
        {
          label: 'Roles y permisos',
          href: `/musicalbands/${hypName}/roles-and-permissions`,
          icon: <AdminPanelSettingsIcon />,
          permission: UserPermissions.VIEW_ROLES_AND_PERMISSIONS
        },
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
                          ? <ArrowDownIcon />
                          : <ArrowRightIcon />
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
