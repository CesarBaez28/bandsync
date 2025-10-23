import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import styles from '../repertoires.module.css'
import { getAllSongsByMusicalBandId } from "@/app/lib/api/songs";
import { ApiResponse, Song } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import Form from "@/app/ui/musicalbands/repertoires/CreateForm";

type CreateRepertoirePageProps = {
  params: Promise<{ hypName: string; }>;
}

export default async function CreateRepertoirePage(props: CreateRepertoirePageProps) {
  const { hypName } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [songs, error] = await handleAsync<ApiResponse<Song[]>>(getAllSongsByMusicalBandId({ musicalBandId: musicalBand?.id }));

  return (
    <div>
      <h2>Crear Repertorio</h2>
      <main className={styles.mainContainer} style={{ marginTop: '1rem' }}>
        {error
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <Form musicalBandId={musicalBand?.id} songs={songs?.data} hypName={hypName} />
          )
        }
      </main>
    </div>
  );
} 