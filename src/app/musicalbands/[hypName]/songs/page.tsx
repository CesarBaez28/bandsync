import styles from './songs.module.css'
import InputContainer from '@/app/ui/musicalbands/songs/InputContainer';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { Metadata } from 'next';
import { Suspense } from 'react';
import SongsTableDataProvider from '@/app/ui/musicalbands/songs/SongsTableDataProvider';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';

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

      <InputContainer hypName={hypName} />

      <main className={styles.mainContainer}>
        <Suspense fallback={
          <>
            <PaginationSkeleton showArrows={false} pages={3} />
            <TableSkeleton columns={5} rows={6} />
          </>
        }>
          <SongsTableDataProvider
            musicalBandId={musicalBand?.id}
            hypName={hypName}
            query={query} page={Number(page)}
          />
        </Suspense>
      </main>

    </div>
  )
}