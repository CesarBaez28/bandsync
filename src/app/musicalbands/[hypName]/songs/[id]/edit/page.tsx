import { getAllArtistsByMusicalBandId } from "@/app/lib/api/artists";
import { getAllMusicalGenresByMusicalBandId } from "@/app/lib/api/musicalGenres";
import { getById } from "@/app/lib/api/songs";
import { ApiResponse, Artist, MusicalBand, MusicalGenre, Song } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import Form from "@/app/ui/musicalbands/songs/EditForm";
import { auth } from "@/auth";


type EdtitSongPageProps = {
  params: Promise<{ hypName: string; id: string }>;
}

export default async function editSongPage(props: EdtitSongPageProps) {
  const [session, { hypName, id }] = await Promise.all([auth(), props.params]);

  const musicalBand: MusicalBand | undefined = session?.user?.musicalBands.find(mb => mb.hyphenatedName === hypName);

  const [[artist, error], [genres, error2], [song, error3]] = await Promise.all([
    handleAsync<ApiResponse<Artist[]>>(getAllArtistsByMusicalBandId({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<MusicalGenre[]>>(getAllMusicalGenresByMusicalBandId({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<Song>>(getById({ id: Number(id), musicalBandId: musicalBand?.id }))
  ]);

  return (
    <div>
      <h2>Editar canción</h2>

      <main className='col-12 col-sm-8 col-md-6 col-lg-5' style={{ marginTop: '1rem' }}>
        {error || error2 || error3
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <Form song={song?.data} musicalBandId={musicalBand?.id} artists={artist?.data} genres={genres?.data} hypName={hypName} />
          )
        }
      </main>
    </div>
  )
}