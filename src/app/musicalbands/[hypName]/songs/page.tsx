import { auth } from '@/auth';
import styles from './songs.module.css'
import { ApiResponse, MusicalBand, PagedData, Song } from '@/app/lib/definitions';
import { handleAsync } from '@/app/lib/utils';
import Pagination from '@/app/ui/pagination/Pagination';
import InputContainer from '@/app/ui/musicalbands/songs/InputContainer';
import SongsTable from '@/app/ui/musicalbands/songs/SongsTable';
import { getSongsByMusicalBandIdAndSearchTerm } from '@/app/lib/api/songs';

type SongsPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function SongsPage(props: SongsPageProps) {
  const [session, { hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    auth(),
    props.params,
    props.searchParams
  ]);

  const musicalBand: MusicalBand | undefined = session?.user?.musicalBands.find(mb => mb.hyphenatedName === hypName);

  const [response, error] = await handleAsync<ApiResponse<PagedData<Song>>>(getSongsByMusicalBandIdAndSearchTerm({
    musicalBandId: musicalBand?.id,
    query,
    page: Number(page)
  }));

  return (
    <div>
      <h2>Canciones</h2>

      <InputContainer hypName={hypName} />

      <main className={styles.mainContainer}>
        {error
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <div>
              <Pagination totalPages={response?.data?.totalPages ?? 0} />
              <SongsTable data={response?.data} musicalBandId={musicalBand?.id} hypName={hypName} />
            </div>
          )
        }
      </main>

    </div>
  )
}