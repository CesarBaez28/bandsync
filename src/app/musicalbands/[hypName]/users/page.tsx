import styles from './users.module.css';
import InputContainer from '@/app/ui/musicalbands/users/InputContainer';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { Suspense } from 'react';
import UsersTableDataProvider from '@/app/ui/musicalbands/users/UsersTableDataProvider';
import TableSkeleton from '@/app/ui/skeletons/TableSkeleton';
import PaginationSkeleton from '@/app/ui/skeletons/PaginationSkeleton';

type UsersPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
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
            <TableSkeleton columns={6} rows={6} />
          </>
        }
        >
          <UsersTableDataProvider
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