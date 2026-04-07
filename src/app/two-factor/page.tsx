import { signOutAction } from "@/app/lib/actions/auth";
import HomeHeader from "@/ui/header/HomeHeader";
import { handleAsync } from "@/app/lib/utils";
import { ApiResponse, User } from "@/app/lib/definitions";
import { getUserById } from "@/app/lib/api/users";
import TwoFactorOptions from "@/ui/two-factor/2FAOptions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticación en dos pasos",
  description: "Autenticación en dos pasos",
};

export default async function TwoFactorPage() {
  const [response, error] = await handleAsync<ApiResponse<User>>(getUserById());

  const is2FAEnabled = response?.data?.is2FAEnabled || false;

  return <>
    <HomeHeader dropDownOptions={[
      { label: 'Inicio', href: '/' },
      { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
    ]} />

    <main style={{ marginTop: '1rem', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {error == null ? (<TwoFactorOptions is2FAEnabled={is2FAEnabled} />) : (
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