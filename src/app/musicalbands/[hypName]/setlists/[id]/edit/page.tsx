import { Metadata } from 'next';
import { UUID } from 'node:crypto';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { getAllRepertoiresByMusicalBandId } from '@/app/lib/api/repertoires';
import { getSetlistDetailsById } from '@/app/lib/api/setlists';
import { ApiResponse, Repertoire, SetlistDetails } from '@/app/lib/definitions';
import { handleAsync } from '@/app/lib/utils';
import Form from '@/app/ui/musicalbands/setlists/SetListForm';

type Props = {
  readonly params: Promise<{ hypName: string; id: UUID }>;
};

export const metadata: Metadata = {
  title: 'Editar SetList',
  description: 'Editar SetList',
};

export default async function EditSetListPage(props: Props) {
  const { hypName, id } = await props.params;
  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [[repertoires, repertoiresError], [setlist, setlistError]] = await Promise.all([
    handleAsync<ApiResponse<Repertoire[]>>(
      getAllRepertoiresByMusicalBandId({ musicalBandId: musicalBand?.id })
    ),
    handleAsync<ApiResponse<SetlistDetails>>(
      getSetlistDetailsById({ setlistId: id, musicalBandId: musicalBand?.id })
    ),
  ]);

  return (
    <main>
      <h2>Editar SetList</h2>
      {repertoiresError || setlistError
        ? <div className="message">
          <h2>¡Lo sentimos!</h2>
          <p>Hubo un error al cargar la página. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
        </div>
        : (
          <Form
            hypName={hypName}
            musicalBandId={musicalBand?.id}
            repertoires={repertoires?.data}
            setListDetails={setlist?.data}
          />
        )
      }
    </main>
  );
}