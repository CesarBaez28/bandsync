import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import styles from '../../repertoires.module.css';
import { getRepertoireById, getRepertoireSongs } from "@/app/lib/api/repertoires";
import { ApiResponse, Repertoire, Song } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import RepertoireSongs from '@/app/ui/musicalbands/repertoires/SeeRepertoireSongs';
import { UUID } from "node:crypto";
import { Metadata } from 'next';

type Props = {
  readonly params: Promise<{ hypName: string; id: UUID }>;
}

export const metadata: Metadata = {
  title: "Ver repertorio",
  description: "Ver repertorio",
};

export default async function SeeRepertoireSongsPage(props: Props) {
  const { hypName, id } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;


  const [[songs, error], [repertoire, error2]] = await Promise.all([
    handleAsync<ApiResponse<Song[]>>(getRepertoireSongs({ repertoireId: id, musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<Repertoire>>(getRepertoireById({ repertoireId: id, musicalBandId: musicalBand?.id }))
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
            <RepertoireSongs songs={songs?.data} />
          )
        }
      </main>
    </div>
  );
}