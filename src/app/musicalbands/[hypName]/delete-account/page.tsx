import { getBandBeforeDeleteAccount } from "@/app/lib/api/users";
import { ApiResponse, MusicalBandDeletionCheck } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import DeleteAccountContent from "@/app/ui/delete-account/DeleteAccountContent";
import syles from './delete-account.module.css';

export default async function DeleteAccountPage() {
  const [response, error] = await handleAsync<ApiResponse<MusicalBandDeletionCheck[]>>(getBandBeforeDeleteAccount());

  return (
    <div>
      <h2>Eliminar cuenta</h2>
      <main className={syles.mainContainer}>
        {error == null ? (<DeleteAccountContent musicalBands={response.data} />) : (
          <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>
              Hubo un error inesperado. Intente refrescar la página o vuelva a visitar la página más tarde.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}