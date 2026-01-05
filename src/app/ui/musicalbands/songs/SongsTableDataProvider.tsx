import { getSongsByMusicalBandIdAndSearchTerm } from "@/app/lib/api/songs";
import { ApiResponse, PagedData, Song } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import { UUID } from "node:crypto";
import Pagination from "../../pagination/Pagination";
import SongsTable from "./SongsTable";

type Props = {
  readonly musicalBandId?: UUID;
  readonly hypName: string;
  readonly query: string;
  readonly page: number;
};

export default async function SongsTableDataProvider({ musicalBandId, hypName, query, page }: Props) {

  const [response, error] = await handleAsync<ApiResponse<PagedData<Song>>>(getSongsByMusicalBandIdAndSearchTerm({
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

    <SongsTable data={response?.data} musicalBandId={musicalBandId} hypName={hypName} />
  </>;
}