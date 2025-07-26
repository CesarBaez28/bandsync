import Pagination from '@/app/ui/pagination/Pagination';
import styles from './genres.module.css'
import { auth } from "@/auth";
import { ApiResponse, MusicalBand, MusicalGenre, PagedData } from '@/app/lib/definitions';
import InputContainer from '@/app/ui/musicalbands/genres/InputContainer';
import { handleAsync } from '@/app/lib/utils';
import { getMusicalGenresByMusicalBandIdAndName } from '@/app/lib/api/musicalGenres';
import MusicalGenresTable from '@/app/ui/musicalbands/genres/MusicalGenresTable';

type GenresPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function GenresPage(props: GenresPageProps) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const params = await props.params;

  const query = searchParams?.query || '';
  const page = Number(searchParams?.page) || 1;
  const hypName = params.hypName;
  const musicalBand: MusicalBand | undefined = session?.user?.musicalBands.find(mb => mb.hyphenatedName === hypName);

  const [response, error] = await handleAsync<ApiResponse<PagedData<MusicalGenre>>>(getMusicalGenresByMusicalBandIdAndName({
    musicalBandId: musicalBand?.id,
    query,
    page
  }));

  return (
    <div>
      <h2>Géneros musicales</h2>

      <InputContainer musicalBandId={musicalBand?.id} hypName={hypName} />

      {
        <main className={styles.mainContainer}>
          {error
            ? <div className="message">
              <h2>¡Lo sentimos!</h2>
              <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
            </div>
            : (
              <div>
                <Pagination totalPages={response?.data?.totalPages ?? 0} />
                <MusicalGenresTable data={response?.data} hypName={hypName} />
              </div>
            )
          }
        </main>
      }

    </div>
  )
}