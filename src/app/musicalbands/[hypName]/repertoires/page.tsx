import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import styles from './repertoires.module.css'
import InputContainer from "@/app/ui/musicalbands/repertoires/InputContainer";
import { Metadata } from 'next';
import { Suspense } from 'react';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';
import RepertoiresTableDataProvider from '@/app/ui/musicalbands/repertoires/RepertoiresTableDataProvider';

type RepertoiresPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Repertorios",
  description: "Repertorios de la banda",
};

export default async function RepertoiresPage(props: RepertoiresPageProps) {
  const [{ hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    props.params,
    props.searchParams
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  return (
    <div>
      <h2>Repertorios</h2>

      <InputContainer hypName={hypName} />

      <main className={styles.mainContainer}>
        <Suspense fallback={
          <>
            <PaginationSkeleton showArrows={false} pages={3} />
            <TableSkeleton columns={3} rows={6} />
          </>
        }>
          <RepertoiresTableDataProvider
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