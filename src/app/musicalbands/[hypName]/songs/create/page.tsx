import Form from '@/app/ui/musicalbands/songs/Form';
import { auth } from '@/auth';
import { ApiResponse, Artist, MusicalBand, MusicalGenre } from '@/app/lib/definitions';
import { handleAsync } from '@/app/lib/utils';
import { getAllArtistsByMusicalBandId } from '@/app/lib/api/artists';
import { getAllMusicalGenresByMusicalBandId } from '@/app/lib/api/musicalGenres';

type CreateSongPageProps = {
  params: Promise<{ hypName: string; }>;
}

export default async function CreateSongPage(props: CreateSongPageProps) {
  const [session, { hypName }] = await Promise.all([auth(), props.params]);

  const musicalBand: MusicalBand | undefined = session?.user?.musicalBands.find(mb => mb.hyphenatedName === hypName);

  const [[artist, error], [genres, error2]] = await Promise.all([
    handleAsync<ApiResponse<Artist[]>>(getAllArtistsByMusicalBandId({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<MusicalGenre[]>>(getAllMusicalGenresByMusicalBandId({ musicalBandId: musicalBand?.id }))
  ]);

  return (
    <div>
      <h2>Registrar Canción</h2>

      <main className='col-12 col-sm-8 col-md-6 col-lg-5' style={{ marginTop: '1rem' }}>
        {error || error2
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <Form musicalBandId={musicalBand?.id} artists={artist?.data} genres={genres?.data} hypName={hypName} />
          )
        }
      </main>
    </div>
  );
}