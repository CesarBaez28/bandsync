'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './breadcrumbs.module.css';

const routeLabels: Record<string, string> = {
  users: 'Integrantes',
  repertoires: 'Repertorios',
  setlists: 'Setlists',
  songs: 'Canciones',
  artists: 'Artistas',
  genres: 'Géneros',
  'musical-roles': 'Roles musicales',
  calendar: 'Calendario',
  settings: 'Configuración',
  'roles-and-permissions': 'Roles y permisos',
  profile: 'Perfil',
  'change-password': 'Cambiar contraseña',
  'two-factor': 'Autenticación en dos pasos',
  'privacy-policy': 'Política de privacidad',
  'terms-of-service': 'Términos del servicio',
};

function getActionLabel(segment: string, parentSegment?: string) {

  const entities: Record<string, string> = {
    repertoires: 'repertorio',
    setlists: 'setlist',
    songs: 'canción',
  };

  const entity = parentSegment ? entities[parentSegment] : undefined;

  if (segment === 'create' && entity) return `Crear ${entity}`;
  if (segment === 'export' && entity) return `Exportar ${entity}`;
  if (segment === 'edit' && entity) return `Editar ${entity}`;
  if (segment === 'see' && entity) return `Ver ${entity}`;

  return routeLabels[segment] ?? segment.replaceAll('-', ' ').replace(/^\p{L}/u, (letter) => letter.toLocaleUpperCase('es'));
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const bandIndex = segments.indexOf('musicalbands');

  if (bandIndex === -1 || !segments[bandIndex + 1]) return null;

  const bandPath = `/${segments.slice(0, bandIndex + 2).join('/')}`;
  const crumbs = [{ label: 'Menú principal', href: bandPath }];

  let href = bandPath;
  let parentSegment: string | undefined;

  for (const segment of segments.slice(bandIndex + 2)) {

    const isEntityId = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(segment)
      || (['repertoires', 'setlists', 'songs'].includes(parentSegment ?? '') && /^\d+$/.test(segment));

    if (isEntityId) continue;

    href += `/${segment}`;

    crumbs.push({
      label: getActionLabel(segment, parentSegment),
      href,
    });
    
    parentSegment = segment;
  }

  return (
    <nav aria-label="Ruta de navegación" className={styles.breadcrumbs}>
      <ol className={styles.list}>
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1;

          return (
            <li className={styles.item} key={crumb.href}>
              {isCurrent ? (
                <span aria-current="page" className={styles.current}>
                  {crumb.label}
                </span>
              ) : (
                <Link className={styles.link} href={crumb.href}>
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}