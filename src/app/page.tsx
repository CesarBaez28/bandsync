import { MusicalBand } from './lib/definitions';
import { getMusicalBandsByUser } from './lib/api/musicalBands';
import MainContent from './ui/home/MainContent';
import { handleAsync } from './lib/utils';
import styles from './page.module.css'

export default async function Home() {
  const [data, errors] = await handleAsync<MusicalBand[]> (getMusicalBandsByUser());

  return (
    <div>
      {errors == null
      ? <MainContent musicalBands={data} />
      : <div className={styles['message']}> 
           <h2>¡Lo sentimos!</h2>
           <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
        </div>
      }
    </div>
  );
}
