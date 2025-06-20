'use client'

import { MusicalBand } from "@/app/lib/definitions";
import styles from './main-content.module.css'
import Link from "next/link";
import CustomImage from "../image/CustomImage";
import { useState } from "react";
import HomeHeader from "./HomeHeader";

type MainContentProps = {
  readonly musicalBands: MusicalBand[] | null
}

export default function MainContent({ musicalBands }: MainContentProps) {
  const [data, setData] = useState<MusicalBand[] | null>(musicalBands);

  return <>
    <HomeHeader setData={setData} />
    <main className={styles['main']}>
      <section>
        {data?.length != 0
          ?
          <>
            <header className={styles['title-main-content']}>
              <h2>Elija la banda a la que desea ingresar</h2>
            </header>

            <article className={styles['options-container']}>
              {data?.map((musicalBand) => (
                <Link key={musicalBand.id} href={`/musicalbands/${musicalBand.hyphenatedName}`} className={styles['option-container']}>
                  <div className={styles['option']}>            
                    <CustomImage 
                      src={musicalBand.logo}
                      alt={`Logo de la banda musical ${musicalBand.name}`}
                      width={120}
                      height={120}
                      fallBackSrc='/image_48dp.svg'
                      className={musicalBand.logo ? styles.image : ''}
                    />
                    <div>
                      <h3>{musicalBand.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </article>
          </>
          :
          <div className={styles['no-musicalbands']}>
            <h2>
              ¡No eres parte de ninguna banda todavía!
            </h2>
            <p>
              Puedes crear una con la opción ubicada arriba o acaptando una invitación
            </p>
          </div>
        }
      </section>
    </main>
  </>;
}