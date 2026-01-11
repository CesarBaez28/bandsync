'use client'

import { usePermissions } from "@/app/lib/customHooks";
import { UserPermissions } from "@/app/lib/permisions";
import Image from "next/image";
import { UUID } from "node:crypto";
import { ReactNode } from "react";
import styles from './main-menu.module.css'
import CustomLink from "../link/CustomLink";

type Props = {
  readonly hypName: string;
  readonly musicalBandId: UUID;
}

type MenuItem = {
  label: string;
  icon?: ReactNode;
  subItems?: { label: string, href: string; permission?: string }[];
  permission?: string;
}

export default function MainMenu({ hypName, musicalBandId }: Props) {
  const { hasPermission } = usePermissions();


  const menuItems: MenuItem[] = [
    {
      label: 'Integrantes',
      icon: <Image src="/group_24dp.svg" alt='Ingegrantes' width={36} height={36} />,
      subItems: [
        {
          label: 'Integrantes',
          href: `/musicalbands/${hypName}/users`
        }
      ],
      permission: UserPermissions.VIEW_MEMBERS
    },
    {
      label: 'Repertorios',
      icon: <Image src='/library_music_24dp.svg' alt='Repertorios' width={36} height={36} />,
      subItems: [
        {
          label: 'Ver repertorios',
          href: `/musicalbands/${hypName}/repertoires`
        },
        {
          label: 'Crear repertorio',
          href: `/musicalbands/${hypName}/repertoires/create`,
          permission: UserPermissions.ADD_REPERTOIRE
        },
        {
          label: 'Exportar repertorio',
          href: `/musicalbands/${hypName}/repertoires/export`
        }
      ]
    },
    {
      label: 'Canciones',
      icon: <Image src='/audio_file_24dp.svg' alt='Canciones' width={36} height={36} />,
      subItems: [
        {
          label: 'Ver canciones',
          href: `/musicalbands/${hypName}/songs`
        },
        {
          label: 'Registrar canción',
          href: `/musicalbands/${hypName}/songs/create`,
          permission: UserPermissions.ADD_SONG
        },
        {
          label: 'Artistas',
          href: `/musicalbands/${hypName}/artists`
        },
        {
          label: 'Géneros',
          href: `/musicalbands/${hypName}/genres`
        }
      ]
    },
    {
      label: 'Roles musicales',
      icon: <Image src='/adaptive_audio_mic_24dp.svg' alt='Roles musicales' width={36} height={36} />,
      subItems: [
        {
          label: 'Roles musicales',
          href: `/musicalbands/${hypName}/musical-roles`
        }
      ]
    },
    {
      label: 'Calendario',
      icon: <Image src='/calendar_month_24dp.svg' alt='Calendario' width={36} height={36} />,
      subItems: [
        {
          label: 'Calendario',
          href: `/musicalbands/${hypName}/calendar`
        }
      ]
    },
    {
      label: 'Configuración',
      icon: <Image src='/settings_24dp.svg' alt='Configuración' width={36} height={36} />,
      subItems: [
        {
          label: 'Banda',
          href: `/musicalbands/${hypName}/settings`
        },
        {
          label: 'Roles y permisos',
          href: `/musicalbands/${hypName}/roles-and-permissions`,
          permission: UserPermissions.VIEW_ROLES_AND_PERMISSIONS
        }
      ]
    },
  ]

  return (
    <section className={styles.optionsContainer}>
      {
        menuItems.map((item) => {
          const canViewOption = item.permission ? hasPermission(item.permission, musicalBandId) : true;
          if (!canViewOption) return null;

          return (
            <article className={styles.optionContainer} key={item.label}>
              <header className={styles.optionHeader}>
                <h2 className={styles.label}>{item.label}</h2>
                {item.icon}
              </header>
              <ul className={styles.itemsContainer}>
                {
                  item.subItems?.map((subItem) => {
                    const canViewSubItem = subItem.permission ? hasPermission(subItem.permission, musicalBandId) : true;
                    if (!canViewSubItem) return null;

                    return (
                      <li className={styles.item} key={subItem.label}>
                        <CustomLink style={{ textDecoration: 'none' }} variant='tertiary' href={subItem.href}>
                          {subItem.label}
                        </CustomLink>
                      </li>
                    )
                  })
                }
              </ul>
            </article>
          )
        })
      }

    </section>
  );
}