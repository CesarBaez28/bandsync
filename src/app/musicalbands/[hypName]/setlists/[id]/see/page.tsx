import { Metadata } from 'next';
import { UUID } from 'node:crypto';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { getSetlistDetailsById } from '@/app/lib/api/setlists';
import { ApiResponse, SetlistDetails } from '@/app/lib/definitions';
import { formatDate, handleAsync } from '@/app/lib/utils';
import SeeSetList from '@/app/ui/musicalbands/setlists/SeeSetList';
import styles from '../../setlists.module.css';
import infoStyles from './setlist-info.module.css';

type Props = {
  readonly params: Promise<{ hypName: string; id: UUID }>;
};

export const metadata: Metadata = {
  title: 'Ver set list',
  description: 'Ver sets y canciones del set list',
};

export default async function SeeSetListPage({ params }: Props) {
  const { hypName, id } = await params;
  
  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [setlistResponse, error] = await handleAsync<ApiResponse<SetlistDetails>>(
    getSetlistDetailsById({ setlistId: id, musicalBandId: musicalBand?.id })
  );

  const setlistDetails = setlistResponse?.data;

  return (
    <div>
      <h2>{setlistDetails?.setList.name ?? 'Ver set list'}</h2>
      <main className={styles.mainContainer} style={{ marginTop: '1rem' }}>
        {error || !setlistDetails
          ? (
            <div className="message">
              <h2>¡Lo sentimos!</h2>
              <p>Hubo un error al cargar el set list. Intente refrescar la página o vuelva a visitarla más tarde.</p>
            </div>
          )
          : (
            <>
              <dl className={infoStyles.metadata}>
                <div className={infoStyles.metadataItem}>
                  <dt>Repertorio</dt>
                  <dd>{setlistDetails.setList.repertoire.name}</dd>
                </div>
                {setlistDetails.setList.description && (
                  <div className={`${infoStyles.metadataItem} ${infoStyles.description}`}>
                    <dt>Descripción</dt>
                    <dd>{setlistDetails.setList.description}</dd>
                  </div>
                )}
                <div className={infoStyles.metadataItem}>
                  <dt>Fecha de creación</dt>
                  <dd>{formatDate(new Date(setlistDetails.setList.createdAt))}</dd>
                </div>
              </dl>
              <SeeSetList sets={setlistDetails.sets} />
            </>
          )
        }
      </main>
    </div>
  );
}