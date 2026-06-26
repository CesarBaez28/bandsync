import styles from './users.module.css';
import stylesResponsive from '@/app/styles/responsive.module.css';
import InputContainer from '@/app/ui/musicalbands/users/InputContainer';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { Suspense } from 'react';
import UsersDataProvider from '@/app/ui/musicalbands/users/UsersDataProvider';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';
import AccordionSkeleton from '@/app/ui/skeletons/AccordionSkeleton';

type UsersPageProps = {
  readonly params: Promise<{ hypName: string; }>;
  readonly searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Integrantes",
  description: "Integrantes de la banda",
};

export default async function UsersPage(props: UsersPageProps) {
  const [{ hypName }, { query = '', page = '1' } = {}, session] = await Promise.all([
    props.params,
    props.searchParams,
    auth()
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;
  const userId = session?.user.id;

  return (
    <div>
      <h2>Integrantes</h2>

      <InputContainer
        hypName={hypName}
        musicalBandId={musicalBand?.id}
        userId={userId}
      />

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
          <UsersDataProvider
            musicalBandId={musicalBand?.id}
            hypName={hypName}
            currentUserId={userId}
            query={query}
            page={Number(page)}
          />
        </Suspense>
      </main>
    </div>
  );
}