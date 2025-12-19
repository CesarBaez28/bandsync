import styles from './users.module.css';
import { handleAsync } from '@/app/lib/utils';
import { ApiResponse, MusicalRole, MusicalRolesUsers, PagedData, User } from '@/app/lib/definitions';
import { getUsersByMusicalBandId } from '@/app/lib/api/users';
import Pagination from '@/app/ui/pagination/Pagination';
import InputContainer from '@/app/ui/musicalbands/users/InputContainer';
import UsersTable from '@/app/ui/musicalbands/users/UsersTable';
import { getAllByMusicalBandId } from '@/app/lib/api/musicalRolesUsers';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { auth } from '@/auth';
import { getAllMusicalRolesByMusicalBandId } from '@/app/lib/api/musicalRoles';
import { Metadata } from 'next';

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
  const userId = session?.user.id

  const [[usersResponse, usersError], [musicalRolesUsersResponse, musicalRolesUsersError], [musicalRoles, musicalRolesError]] = await Promise.all([
    handleAsync<ApiResponse<PagedData<User>>>(getUsersByMusicalBandId({
      musicalBandId: musicalBand?.id,
      query,
      page: Number(page)
    })),
    handleAsync<ApiResponse<MusicalRolesUsers[]>>(getAllByMusicalBandId({
      musicalBandId: musicalBand?.id
    })),
    handleAsync<ApiResponse<MusicalRole[]>>(getAllMusicalRolesByMusicalBandId({
      musicalBandId: musicalBand?.id
    }))
  ])

  return (
    <div>
      <h2>Integrantes</h2>

      <InputContainer hypName={hypName} musicalBandId={musicalBand?.id} userId={userId} />

      <main className={styles.mainContainer}>
        {usersError || musicalRolesUsersError || musicalRolesError
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <div>
              <Pagination totalPages={usersResponse?.data?.totalPages ?? 0} />
              <UsersTable
                musicalBandId={musicalBand?.id}
                users={usersResponse?.data}
                musicalRolesUsers={musicalRolesUsersResponse?.data}
                musicalRoles={musicalRoles?.data}
                hypName={hypName}
                currentUserId={userId}
              />
            </div>
          )
        }

      </main>
    </div>
  );
}