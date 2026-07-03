import { config } from "@/app/lib/config";
import HomeHeader from "@/app/ui/header/HomeHeader";
import { Metadata } from "next";
import { auth } from "@/auth";
import { signOutAction } from "@/app/lib/actions/auth";
import TermsOfServiceContent from "@/app/ui/legal/TermsOfServiceContent";

export const metadata: Metadata = {
  title: "Condiciones de uso",
  description: `Condiciones de uso para ${config.appName}.`,
};

export default async function TermsOfServicePage() {
  const session = await auth();
  const isAuthenticated = !!session;

  const dropDownOptions = isAuthenticated
    ? [
      { label: 'Inicio', href: '/' },
      { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
    ]
    : [{ label: "Iniciar sesión", href: "/login" }];


  return (
    <>
      <HomeHeader dropDownOptions={dropDownOptions} />
      <div style={{ marginTop: '1rem', padding: '1rem' }}>
        <TermsOfServiceContent appName={config.appName} />
      </div>
    </>
  );
}