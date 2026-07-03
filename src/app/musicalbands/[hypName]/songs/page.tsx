import stylesResponsive from '@/app/styles/responsive.module.css';
import styles from './songs.module.css'
import InputContainer from '@/app/ui/musicalbands/songs/InputContainer';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { Metadata } from 'next';
import { Suspense } from 'react';
import SongsDataProvider from '@/app/ui/musicalbands/songs/SongsDataProvider';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';
import AccordionSkeleton from '@/app/ui/skeletons/AccordionSkeleton';

type SongsPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Canciones",
  description: "Canciones de la banda",
};

export default async function SongsPage(props: SongsPageProps) {
  const [{ hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    props.params,
    props.searchParams
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  return (
    <div>
      <h2>Canciones</h2>

      <InputContainer hypName={hypName} musicalBandId={musicalBand?.id} />

      <main className={styles.mainContainer}>
        <Suspense fallback={
          <>
            <PaginationSkeleton showArrows={false} pages={3} />
            <div className={stylesResponsive.desktopOnly}>
              <TableSkeleton columns={6} rows={6} />
            </div>

            <div className={stylesResponsive.mobileOnly}>
              <AccordionSkeleton />
              <AccordionSkeleton />
              <AccordionSkeleton />
            </div>
          </>
        }>
          <SongsDataProvider
            musicalBandId={musicalBand?.id}
            hypName={hypName}
            query={query} page={Number(page)}
          />
        </Suspense>
      </main>

    </div>
  )
}