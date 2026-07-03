import stylesResponsive from '@/app/styles/responsive.module.css';
import styles from './genres.module.css'
import InputContainer from '@/app/ui/musicalbands/genres/InputContainer';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { Metadata } from 'next';
import { Suspense } from 'react';
import MusicalGenresTableDataProvider from '@/app/ui/musicalbands/genres/MusicalGenresDataProvider';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';
import AccordionSkeleton from '@/app/ui/skeletons/AccordionSkeleton';

type GenresPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Géneros musicales",
  description: "Géneros musicales",
};

export default async function GenresPage(props: GenresPageProps) {
  const [{ hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    props.params,
    props.searchParams
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  return (
    <div>
      <h2>Géneros musicales</h2>

      <InputContainer musicalBandId={musicalBand?.id} hypName={hypName} />

      {
        <main className={styles.mainContainer}>
          <Suspense fallback={
            <>
              <PaginationSkeleton showArrows={false} pages={3} />
              <div className={stylesResponsive.desktopOnly}>
                <TableSkeleton columns={2} rows={6} />
              </div>

              <div className={stylesResponsive.mobileOnly}>
                <AccordionSkeleton />
                <AccordionSkeleton />
                <AccordionSkeleton />
              </div>
            </>
          }>
            <MusicalGenresTableDataProvider
              musicalBandId={musicalBand?.id}
              hypName={hypName}
              query={query}
              page={Number(page)}
            />
          </Suspense>
        </main>
      }

    </div>
  )
}