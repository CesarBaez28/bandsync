import { handleAsync } from "@/app/lib/utils";
import UsersTable from "./UsersTable";
import { getAllMusicalRolesByMusicalBandId } from "@/app/lib/api/musicalRoles";
import { getUsersByMusicalBandId } from "@/app/lib/api/users";
import { getAllByMusicalBandId } from "@/app/lib/api/musicalRolesUsers";
import { UUID } from "node:crypto";
import Pagination from "../../pagination/Pagination";

type Props = {
  readonly musicalBandId?: UUID;
  readonly hypName: string;
  readonly currentUserId?: string;
  readonly query: string;
  readonly page: number;
};

export default async function UsersTableDataProvider({
  musicalBandId,
  hypName,
  currentUserId,
  query,
  page
}: Props) {

  const [
    [usersResponse, usersError],
    [musicalRolesUsersResponse, musicalRolesUsersError],
    [musicalRoles, musicalRolesError]
  ] = await Promise.all([
    handleAsync(getUsersByMusicalBandId({
      musicalBandId,
      query,
      page
    })),
    handleAsync(getAllByMusicalBandId({ musicalBandId })),
    handleAsync(getAllMusicalRolesByMusicalBandId({ musicalBandId }))
  ]);

  if (usersError || musicalRolesUsersError || musicalRolesError) {
    return (
      <div className="message">
        <h2>¡Lo sentimos!</h2>
        <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
      </div>
    );
  }

  return <>
    <Pagination totalPages={usersResponse.data?.totalPages ?? 0} />

    <UsersTable
      musicalBandId={musicalBandId}
      users={usersResponse?.data}
      musicalRolesUsers={musicalRolesUsersResponse?.data}
      musicalRoles={musicalRoles?.data}
      hypName={hypName}
      currentUserId={currentUserId}
    />
  </>;
}