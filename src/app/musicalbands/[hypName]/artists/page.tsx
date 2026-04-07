import styles from './artists.module.css';
import InputContainer from "@/app/ui/musicalbands/artists/InputContainer";
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ArtistsTableDataProvider from '@/app/ui/musicalbands/artists/ArtistsTableDataProvider';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';

type ArtistPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Artistas",
  description: "Artistas",
};

export default async function ArtistsPage(props: ArtistPageProps) {
  const [{ hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    props.params,
    props.searchParams
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  return (
    <div>
      <h2>Artistas</h2>

      <InputContainer musicalBandId={musicalBand?.id} hypName={hypName} />

      <main className={styles.mainContainer}>
        <Suspense fallback={
          <>
            <PaginationSkeleton showArrows={false} pages={3} />
            <TableSkeleton columns={2} rows={6} />
          </>
        }>
          <ArtistsTableDataProvider
            musicalBandId={musicalBand?.id}
            hypName={hypName}
            query={query}
            page={Number(page)}
          />
        </Suspense>
      </main>

    </div>
  );
}