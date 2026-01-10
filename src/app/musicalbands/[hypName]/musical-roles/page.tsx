import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import styles from './musical-roles.module.css';
import InputContainer from '@/app/ui/musicalbands/musical-roles/InputContaimer';
import { Metadata } from 'next';
import { Suspense } from 'react';
import MusicalRolesTableDataProvider from '@/app/ui/musicalbands/musical-roles/MusicalRolesTableDataProvider';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';

type MusicalRolesPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Roles musicales",
  description: "Roles musicales",
};

export default async function MusicalRolesPage(props: MusicalRolesPageProps) {
  const [{ hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    props.params,
    props.searchParams
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  return (
    <div>
      <h2>Roles Musicales</h2>

      <InputContainer musicalBandId={musicalBand?.id} hypName={hypName} />

      <main className={styles.mainContainer}>

        <Suspense fallback={
          <>
            <PaginationSkeleton showArrows={false} pages={3} />
            <TableSkeleton columns={2} rows={6} />
          </>
        }>
          <MusicalRolesTableDataProvider
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