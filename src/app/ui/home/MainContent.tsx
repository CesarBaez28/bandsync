'use client'

import Image from "next/image";
import { MusicalBand } from "@/app/lib/definitions";
import styles from './main-content.module.css'
import Link from "next/link";
import clsx from "clsx";

type MainContentProps = {
  readonly musicalBands: MusicalBand[]
}

export default function MainContent({ musicalBands }: MainContentProps) {
  return (
    <main className={styles['main']}>
      <section>
        {musicalBands?.length != 0
          ?
          <>
            <header className={styles['title-main-content']}>
              <h2>Elija la banda a la que desea ingresar</h2>
            </header>

            <article className={styles['options-container']}>
              {musicalBands?.map((musicalBand) => (
                <Link key={musicalBand.id} href={`/musicalbands/${musicalBand.hyphenatedName}`} className={styles['option-container']}>
                  <div className={styles['option']}>
                    <Image
                      className={
                        clsx (
                          musicalBand.logo 
                          ? styles['image']
                          : ""
                        )
                      }
                      src={ musicalBand.logo ? musicalBand.logo : '/image_48dp.svg'}
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
  )
}