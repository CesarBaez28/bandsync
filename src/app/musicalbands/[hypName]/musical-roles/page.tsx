import stylesResponsive from '@/app/styles/responsive.module.css';
import styles from './musical-roles.module.css';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import InputContainer from '@/app/ui/musicalbands/musical-roles/InputContainer';
import { Metadata } from 'next';
import { Suspense } from 'react';
import MusicalRolesDataProvider from '@/app/ui/musicalbands/musical-roles/MusicalRolesDataProvider';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';
import AccordionSkeleton from '@/app/ui/skeletons/AccordionSkeleton';

type MusicalRolesPageProps = {
  readonly params: Promise<{ hypName: string; }>;
  readonly searchParams?: Promise<{
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
          <MusicalRolesDataProvider
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