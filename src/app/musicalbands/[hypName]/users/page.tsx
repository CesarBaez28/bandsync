import styles from './users.module.css';
import { handleAsync } from '@/app/lib/utils';
import { ApiResponse, MusicalRolesUsers, PagedData, User } from '@/app/lib/definitions';
import { getUsersByMusicalBandId } from '@/app/lib/api/users';
import Pagination from '@/app/ui/pagination/Pagination';
import InputContainer from '@/app/ui/musicalbands/users/InputContainer';
import UsersTable from '@/app/ui/musicalbands/users/UsersTable';
import { getAllByMusicalBandId } from '@/app/lib/api/musicalRolesUsers';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';

type UsersPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function UsersPage(props: UsersPageProps) {
  const [{ hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [[usersResponse, usersError], [musicalRolesResponse, musicalRolesError]] = await Promise.all([
    handleAsync<ApiResponse<PagedData<User>>>(getUsersByMusicalBandId({
      musicalBandId: musicalBand?.id,
      query,
      page: Number(page)
    })),
    handleAsync<ApiResponse<MusicalRolesUsers[]>>(getAllByMusicalBandId({
      musicalBandId: musicalBand?.id
    }))
  ])

  return (
    <div>
      <h2>Integrantes</h2>

      <InputContainer />

      <main className={styles.mainContainer}>
        {usersError || musicalRolesError
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <div>
              <Pagination totalPages={usersResponse?.data?.totalPages ?? 0} />
              <UsersTable users={usersResponse?.data} musicalRolesUsers={musicalRolesResponse?.data} hypName={hypName} />
            </div>
          )
        }

      </main>
    </div>
  );
}