import ChangePasswordForm from "@/app/ui/change-password/ChangePasswordForm";
import { signOutAction } from "../lib/actions/auth";
import HomeHeader from "../ui/header/HomeHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cambiar contraseña",
  description: "Cambiar contraseña",
};

export default function ChangePasswordPage() {
  return <>
    <HomeHeader dropDownOptions={[
      { label: 'Inicio', href: '/' },
      { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
    ]} />

    <main style={{ marginTop: '1rem', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Cambiar contraseña</h2>
      <ChangePasswordForm />
    </main>
  </>;
}