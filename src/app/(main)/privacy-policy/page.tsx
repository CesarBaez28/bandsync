import { config } from "@/app/lib/config";
import HomeHeader from "@/app/ui/header/HomeHeader";
import { Metadata } from "next";
import { auth } from "@/auth";
import { signOutAction } from "@/app/lib/actions/auth";
import PrivacyPolicyContent from "@/app/ui/legal/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Políticas de privacidad",
  description: `Políticas de privacidad para ${config.appName}.`,
};

export default async function PrivacyPage() {
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
        <PrivacyPolicyContent appName={config.appName} />
      </div>
    </>
  );
}