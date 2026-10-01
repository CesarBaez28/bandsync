import { searchSetlistsByMusicalBandId } from "@/app/lib/api/setlists";
import { ApiResponse, PagedData, Setlist } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import { UUID } from "node:crypto";
import Pagination from "../../pagination/Pagination";
import SetListsContent from "./SetListsContent";

type Props = {
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
  readonly query: string;
  readonly page: number;
};

export default async function SetListDataProvider({ musicalBandId, hypName, query, page }: Props) {

  const [response, error] = await handleAsync<ApiResponse<PagedData<Setlist>>>(searchSetlistsByMusicalBandId({
    musicalBandId: musicalBandId,
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

    <SetListsContent data={response?.data} musicalBandId={musicalBandId} hypName={hypName} />
  </>;
}