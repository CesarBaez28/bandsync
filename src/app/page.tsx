import styles from '@/app/page.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { HeaderButton } from '@/app/ui/Buttons/HeaderButton';
import { MusicalBand } from './lib/definitions';
import { getMusicalBandsByUser } from './lib/api/musicalBands';

export default async function Home() {
  const musicalBands: MusicalBand[] = await getMusicalBandsByUser({ id: '0e05e942-eff3-11ef-af2b-8758219fbac8' });

  return (
    <div>
      <header className={styles.header}>
        <h2>BandSync</h2>
        <div className={styles['header-buttons']}>
          <HeaderButton
            iconPath="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
            label="Crear una banda"
            ariaLabel="Crear una banda"
          />
          <HeaderButton
            iconPath="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Z"
            className={styles['profile-button']}
            ariaLabel="Perfil del usuario"
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
