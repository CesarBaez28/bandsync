import styles from '../repertoires.module.css'
import { handleAsync, urlToBase64 } from "@/app/lib/utils";
import { ApiResponse, Repertoire } from "@/app/lib/definitions";
import { getAllRepertoiresByMusicalBandId } from "@/app/lib/api/repertoires";
import ExportRerpertoiresContent from "@/app/ui/musicalbands/repertoires/ExportRepertoiresContent";
import { getMusicalBandByHyphenatedName } from "@/app/lib/api/musicalBands";

type Props = {
  params: Promise<{ hypName: string; }>;
}

export default async function ExportPage(props: Props) {
  const { hypName } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [response, error] = await handleAsync<ApiResponse<Repertoire[]>>(getAllRepertoiresByMusicalBandId({ musicalBandId: musicalBand?.id }));
  const imageBase64 = await urlToBase64(musicalBand?.logo);

  return (
    <div>
      <h2>Exportar Repertorios</h2>
      <main className={styles.mainContainer}>
        {error
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <ExportRerpertoiresContent repertoires={response?.data} imageBase64={imageBase64} musicalBand={musicalBand}/>
          )
        }
      </main>
    </div>
  )
}