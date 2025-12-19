import styles from './artists.module.css';
import ArtistTable from "@/app/ui/musicalbands/artists/ArtistsTable";
import { ApiResponse, Artist, PagedData } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import { getArtistsByMusicalBandIdAndName } from "@/app/lib/api/artists";
import Pagination from "@/app/ui/pagination/Pagination";
import InputContainer from "@/app/ui/musicalbands/artists/InputContainer";
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { Metadata } from 'next';

type ArtistPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Artistas",
  description: "Artistas",
};

export default async function ArtistsPage(props: ArtistPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const query = searchParams?.query || '';
  const page = Number(searchParams?.page) || 1;
  const hypName = params.hypName;
  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [response, error] = await handleAsync<ApiResponse<PagedData<Artist>>>(getArtistsByMusicalBandIdAndName({
    musicalBandId: musicalBand?.id,
    query,
    page
  }));

  return (
    <div>
      <h2>Artistas</h2>

      <InputContainer musicalBandId={musicalBand?.id} hypName={hypName} />

      <main className={styles.mainContainer}>
        {error
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <div>
              <Pagination totalPages={response?.data?.totalPages ?? 0} />
              <ArtistTable data={response?.data} hypName={hypName} musicalBandId={musicalBand?.id} />
            </div>
          )
        }
      </main>

    </div>
  );
}