import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import styles from './musical-roles.module.css';
import { getMusicalRolesByMusicalBandIdAndName } from "@/app/lib/api/musicalRoles";
import { ApiResponse, MusicalRole, PagedData } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import InputContainer from '@/app/ui/musicalbands/musical-roles/InputContaimer';
import MusicalRoleTable from '@/app/ui/musicalbands/musical-roles/MusicalRoleTable';
import Pagination from "@/app/ui/pagination/Pagination";

type MusicalRolesPageProps = {
  params: Promise<{ hypName: string; }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function MusicalRolesPage(props: MusicalRolesPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const query = searchParams?.query || '';
  const page = Number(searchParams?.page) || 1;
  const hypName = params.hypName;
  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [response, error] = await handleAsync<ApiResponse<PagedData<MusicalRole>>>(getMusicalRolesByMusicalBandIdAndName({
    musicalBandId: musicalBand?.id,
    query,
    page
  }));

  return (
    <div>
      <h2>Roles Musicales</h2>

      <InputContainer musicalBandId={musicalBand?.id} hypName={hypName} />

      <main className={styles.mainContainer}>
        {error
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <div>
              <Pagination totalPages={response?.data?.totalPages ?? 0} />
              <MusicalRoleTable data={response?.data} hypName={hypName} musicalBandId={musicalBand?.id} />
            </div>
          )
        }
      </main>

    </div>
  );
}