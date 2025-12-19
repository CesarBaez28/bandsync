import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import styles from './repertoires.module.css'
import { getRepertoiresByMusicalBandId } from "@/app/lib/api/repertoires";
import { ApiResponse, PagedData, Repertoire } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import InputContainer from "@/app/ui/musicalbands/repertoires/InputContainer";
import RepertoiresTable from "@/app/ui/musicalbands/repertoires/RepertoiresTable";
import Pagination from "@/app/ui/pagination/Pagination";
import { Metadata } from 'next';

type RepertoiresPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Repertorios",
  description: "Repertorios de la banda",
};

export default async function RepertoiresPage(props: RepertoiresPageProps) {
  const [{ hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    props.params,
    props.searchParams
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [response, error] = await handleAsync<ApiResponse<PagedData<Repertoire>>>(getRepertoiresByMusicalBandId({
    musicalBandId: musicalBand?.id,
    query,
    page: Number(page)
  }));

  return (
    <div>
      <h2>Repertorios</h2>

      <InputContainer hypName={hypName} />

      <main className={styles.mainContainer}>
        {error
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <div>
              <Pagination totalPages={response?.data?.totalPages ?? 0} />
              <RepertoiresTable data={response?.data} musicalBandId={musicalBand?.id} hypName={hypName} />
            </div>
          )
        }
      </main>
    </div>
  );
}