import { getAllSongsByMusicalBandId } from "@/app/lib/api/songs";
import { ApiResponse, Repertoire, Song } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import { auth } from "@/auth";
import styles from '../../repertoires.module.css'
import { getRepertoireById, getRepertoireSongs } from "@/app/lib/api/repertoires";
import { UUID } from "crypto";
import Form from "@/app/ui/musicalbands/repertoires/EditForm";

type EdtitRepertoiresPageProps = {
  params: Promise<{ hypName: string; id: UUID }>;
}

export default async function EditRepertoirePage(props: EdtitRepertoiresPageProps) {
  const [session, { hypName, id }] = await Promise.all([auth(), props.params]);

  const musicalBand = session?.user?.musicalBands.find(mb => mb.hyphenatedName === hypName);

  const [[songs, error], [repertoire, error2], [repertoireSongs, error3]] = await Promise.all(
    [
      handleAsync<ApiResponse<Song[]>>(getAllSongsByMusicalBandId({ musicalBandId: musicalBand?.id })),
      handleAsync<ApiResponse<Repertoire>>(getRepertoireById({ repertoireId: id, musicalBandId: musicalBand?.id })),
      handleAsync<ApiResponse<Song[]>>(getRepertoireSongs({ repertoireId: id, musicalBandId: musicalBand?.id }))
    ]
  );

  return (
    <div>
      <h2>Editar Repertorio</h2>
      <main className={styles.mainContainer} style={{ marginTop: '1rem' }}>
        {error || error2 || error3
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <Form repertoire={repertoire?.data} repertoireSongs={repertoireSongs?.data} songs={songs?.data} musicalBandId={musicalBand?.id} hypName={hypName} />
          )
        }
      </main>
    </div>
  );
}