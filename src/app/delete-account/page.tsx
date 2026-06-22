import HomeHeader from "@/ui/header/HomeHeader";
import { signOutAction } from "@/app/lib/actions/auth";
import { getBandBeforeDeleteAccount } from "../lib/api/users";
import { ApiResponse, MusicalBandDeletionCheck } from "../lib/definitions";
import { handleAsync } from "../lib/utils";
import DeleteAccountContent from "../ui/delete-account/DeleteAccountContent";

export default async function DeleteAccountPage() {
  const [response, error] = await handleAsync<ApiResponse<MusicalBandDeletionCheck[]>>(getBandBeforeDeleteAccount());

  return <>
    <HomeHeader dropDownOptions={[
      { label: 'Inicio', href: '/' },
      { label: 'Ver perfil', href: '/profile' },
      { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
    ]} />

    <main style={{ marginTop: '1rem', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <h2>Eliminar cuenta</h2>

      {error == null ? (<DeleteAccountContent musicalBands={response.data} />) : (
        <div className="message">
          <h2>¡Lo sentimos!</h2>
          <p>
            Hubo un error inesperado. Intente refrescar la página o vuelva a visitar la página más tarde.
          </p>
        </div>
      )}

    </main>
  </>;
}