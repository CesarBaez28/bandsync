import { ReactNode } from 'react';
import styles from './page.module.css'
import Image from 'next/image';
import CustomLink from '@/app/ui/link/CustomLink';
import { Metadata } from 'next';

type MenuItem = {
  label: string;
  icon?: ReactNode;
  subItems?: { label: string, href: string }[]
}

type Props = {
  params: Promise<{ hypName: string; }>;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const hypName = (await params).hypName

  return {
    title: `Menú principal :: ${hypName}`,
    description: 'Banda musical',
  };
}
export default async function MusicalBandPage(props: Props) {
  const hypName = (await props.params).hypName;

  const menuItems: MenuItem[] = [
    {
      label: 'Integrantes',
      icon: <Image src="/group_24dp.svg" alt='Ingegrantes' width={36} height={36} />,
      subItems: [
        {
          label: 'Integrantes',
          href: `/musicalbands/${hypName}/users`
        }
      ]
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
          href: `/musicalbands/${hypName}/repertoires/create`
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
          href: `/musicalbands/${hypName}/songs/create`
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
          href: `/musicalbands/${hypName}/roles-and-permissions`
        }
      ]
    },
  ]

  return (
    <main>
      <section className={styles.optionsContainer}>

        {menuItems.map((item) => (
          <article className={styles.optionContainer} key={item.label}>
            <header className={styles.optionHeader}>
              <h2 className={styles.label}>{item.label}</h2>
              {item.icon}
            </header>
            <ul className={styles.itemsContainer}>
              {item.subItems?.map((subItem) => (
                <li className={styles.item} key={subItem.label}>
                  <CustomLink style={{textDecoration: 'none'}} variant='tertiary' href={subItem.href}>
                    {subItem.label}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </article>
        ))}

      </section>
    </main>
  );
}
