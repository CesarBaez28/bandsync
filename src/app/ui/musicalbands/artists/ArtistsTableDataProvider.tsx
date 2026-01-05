import { getArtistsByMusicalBandIdAndName } from "@/app/lib/api/artists";
import { ApiResponse, Artist, PagedData } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import { UUID } from "node:crypto";
import Pagination from "../../pagination/Pagination";
import ArtistTable from "./ArtistsTable";

type Props = {
  readonly musicalBandId?: UUID;
  readonly hypName: string;
  readonly query: string;
  readonly page: number;
};

export default async function ArtistsTableDataProvider({ musicalBandId, hypName, query, page }: Props) {

  const [response, error] = await handleAsync<ApiResponse<PagedData<Artist>>>(getArtistsByMusicalBandIdAndName({
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

    <ArtistTable
      musicalBandId={musicalBandId}
      data={response?.data}
      hypName={hypName}
    />
  </>
}