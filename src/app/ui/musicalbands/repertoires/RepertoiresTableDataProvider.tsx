import { getRepertoiresByMusicalBandId } from "@/app/lib/api/repertoires";
import { ApiResponse, PagedData, Repertoire } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import Pagination from "../../pagination/Pagination";
import RepertoiresTable from "./RepertoiresTable";
import { UUID } from "node:crypto";

type Props = {
  readonly musicalBandId?: UUID;
  readonly hypName: string;
  readonly query: string;
  readonly page: number;
}

export default async function RepertoiresTableDataProvider({ musicalBandId, hypName, query, page }: Props) {

  const [response, error] = await handleAsync<ApiResponse<PagedData<Repertoire>>>(getRepertoiresByMusicalBandId({
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

  return (
    <>
      <Pagination totalPages={response?.data?.totalPages ?? 0} />
      <RepertoiresTable data={response?.data} musicalBandId={musicalBandId} hypName={hypName} />
    </>
  );
}