import styles from '../setlists.module.css'
import { getMusicalBandByHyphenatedName } from "@/app/lib/api/musicalBands";
import { getSetListsByMusicalBandId } from "@/app/lib/api/setlists";
import { ApiResponse, Setlist } from "@/app/lib/definitions";
import { handleAsync, urlToBase64 } from "@/app/lib/utils";
import ExportSetListsContent from '@/app/ui/musicalbands/setlists/ExportSetListsContent';
import { Metadata } from "next";

type Props = {
  readonly params: Promise<{ hypName: string; }>;
}

export const metadata: Metadata = {
  title: "Exportar set list",
  description: "Exportar set list",
};

export default async function ExportPage(props: Props) {
  const { hypName } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [response, error] = await handleAsync<ApiResponse<Setlist[]>>(getSetListsByMusicalBandId(
    { musicalBandId: musicalBand?.id }
  ));

  const imageBase64 = await urlToBase64(musicalBand?.logo);

  return (
    <div>
      <h2>Exportar Set List</h2>
      <main className={styles.mainContainer}>
        {error
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <ExportSetListsContent setlists={response.data} imageBase64={imageBase64} musicalBand={musicalBand} />
          )
        }
      </main>
    </div>
  )
}