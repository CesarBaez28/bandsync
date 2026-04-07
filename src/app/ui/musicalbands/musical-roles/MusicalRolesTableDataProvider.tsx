import { handleAsync } from "@/app/lib/utils";
import Pagination from "../../pagination/Pagination";
import MusicalRoleTable from "./MusicalRoleTable";
import { getMusicalRolesByMusicalBandIdAndName } from "@/app/lib/api/musicalRoles";
import { ApiResponse, MusicalRole, PagedData } from "@/app/lib/definitions";
import { UUID } from "node:crypto";

export type Props = {
  readonly musicalBandId?: UUID;
  readonly hypName: string;
  readonly query: string;
  readonly page: number;
};

export default async function MusicalRolesTableDataProvider({
  musicalBandId,
  hypName,
  query,
  page
}: Props) {

  const [response, error] = await handleAsync<ApiResponse<PagedData<MusicalRole>>>(getMusicalRolesByMusicalBandIdAndName({
    musicalBandId,
    query,
    page: Number(page)
  }));

  if (error) {
    return (
      <div className="message">
        <h2>¡Lo sentimos!</h2>
        <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
      </div>
    );
  }

  return <>
    <Pagination totalPages={response?.data?.totalPages ?? 0} />

    <MusicalRoleTable
      musicalBandId={musicalBandId}
      data={response?.data}
      hypName={hypName}
    />

  </>;
}