import Form from '@/app/ui/musicalbands/songs/CreateForm';
import { ApiResponse, Artist, MusicalGenre } from '@/app/lib/definitions';
import { handleAsync } from '@/app/lib/utils';
import { getAllArtistsByMusicalBandId } from '@/app/lib/api/artists';
import { getAllMusicalGenresByMusicalBandId } from '@/app/lib/api/musicalGenres';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';

type CreateSongPageProps = {
  params: Promise<{ hypName: string; }>;
}

export default async function CreateSongPage(props: CreateSongPageProps) {
  const { hypName } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

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