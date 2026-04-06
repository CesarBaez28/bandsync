import { signOutAction } from "@/app/lib/actions/auth";
import { SetUp2FA, setUp2FA } from "@/app/lib/api/users";
import { ApiResponse } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import HomeHeader from "@/app/ui/header/HomeHeader";
import Setup2FAView from "@/app/ui/two-factor/Setup2FA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurar autenticación en dos pasos",
  description: "Configurar autenticación en dos pasos",
};

export default async function Configure2FAPage() {
  const [setupResponse, setupError] = await handleAsync<ApiResponse<SetUp2FA>>(setUp2FA());

  return <>
    <HomeHeader dropDownOptions={[
      { label: 'Inicio', href: '/' },
      { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
    ]} />

    <main style={{ marginTop: '1rem', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Configurar autenticación de dos factores</h2>

      {setupError == null ? (
        <Setup2FAView setUpResponse={setupResponse?.data || null} />
      ) : (
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