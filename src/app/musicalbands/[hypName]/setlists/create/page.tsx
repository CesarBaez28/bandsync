import { Metadata } from 'next';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { getAllRepertoiresByMusicalBandId } from '@/app/lib/api/repertoires';
import { ApiResponse, Repertoire } from '@/app/lib/definitions';
import { handleAsync } from '@/app/lib/utils';
import Form from '@/app/ui/musicalbands/setlists/SetListForm';

export const metadata: Metadata = {
  title: "Crear SetList",
  description: "Crear SetLists",
};

type Props = {
  readonly params: Promise<{ hypName: string; }>;
}

export default async function CreateSetListPage(props: Props) {
  const { hypName } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [repertoires, error] = await handleAsync<ApiResponse<Repertoire[]>>(getAllRepertoiresByMusicalBandId({ musicalBandId: musicalBand?.id }));

  return (
    <main>
      <h2>Crear SetList</h2>
      {error
        ? <div className="message">
          <h2>¡Lo sentimos!</h2>
          <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
        </div>
        : (
          <Form hypName={hypName} musicalBandId={musicalBand?.id} repertoires={repertoires.data} />
        )
      }
    </main>
  )

}
