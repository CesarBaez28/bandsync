import styles from '../../repertoires.module.css';
import { getRepertoireById, getRepertoireSongs } from "@/app/lib/api/repertoires";
import { ApiResponse, Repertoire, Song } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import RepertoireSongsTable from '@/app/ui/musicalbands/repertoires/SeeRepertoireSongsTable';
import { auth } from "@/auth";
import { UUID } from "crypto";

type Props = {
  params: Promise<{ hypName: string; id: UUID }>;
}

export default async function SeeRepertoireSongsPage(props: Props) {
  const [session, { hypName, id }] = await Promise.all([auth(), props.params]);

  const musicalBand = session?.user?.musicalBands.find(mb => mb.hyphenatedName === hypName);


  const [[songs, error], [repertoire, error2]] = await Promise.all([
    handleAsync<ApiResponse<Song[]>>(getRepertoireSongs({ repertoireId: id, musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<Repertoire>>(getRepertoireById({repertoireId: id, musicalBandId: musicalBand?.id}))
  ]);

  return (
    <div>
      <h2>{repertoire?.data?.name}</h2>
      <main className={styles.mainContainer} style={{ marginTop: '1rem' }}>
        {error || error2
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <RepertoireSongsTable songs={songs?.data}/>
          )
        }
      </main>
    </div>
  );
}