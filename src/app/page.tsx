import styles from '@/app/page.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { MusicalBand } from './lib/definitions';
import { getMusicalBandsByUser } from './lib/api/musicalBands';
import CustomButton from './ui/button/CustomButton';
import { signOutAction } from './lib/actions/auth';
import DropdownMenu from './ui/dropdown/DropdownMenu';

export default async function Home() {
  const musicalBands: MusicalBand[] = await getMusicalBandsByUser();

  return (
    <div>
      <header className={styles.header}>
        <h2>BandSync</h2>
        <div className={styles['header-buttons']}>
          <CustomButton
            iconLeft={<Image
              src="/add_24dp.svg"
              alt="Icono de añadir banda"
              width={24}
              height={24}
            />
            }
            variant='secondary'
            style={{ padding: '0.4rem 0.4rem' }}
          >
            Crear una banda
          </CustomButton>

          <DropdownMenu
            trigger={
              <CustomButton variant="secondary" style={{ padding: '0.4rem' }}>
                <Image src="/person_24dp.svg" alt="perfil" width={24} height={24} />
              </CustomButton>
            }
            options={[
              { label: 'Ver perfil', href: '/profile'},
              { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
            ]}
          />

        </div>
      </header>

      <main className={styles['main']}>
        <section>
          <header className={styles['title-main-content']}>
            <h2>Elija la banda a la que desea ingresar</h2>
          </header>

          <article className={styles['options-container']}>

            {musicalBands.map((musicalBand) => (
              <Link key={musicalBand.id} href={`/musical-bands/${musicalBand.hyphenatedName}`} className={styles['option-container']}>
                <div className={styles['option']}>
                  <Image
                    className={styles['image']}
                    src={'/image_48dp.svg'}
                    alt='musical band image'
                    width={120}
                    height={120}
                  />
                  <div>
                    <h3>{musicalBand.name}</h3>
                  </div>
                </div>
              </Link>
            ))}

          </article>
        </section>
      </main>
    </div>
  );
}
