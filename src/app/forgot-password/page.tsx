import HomeHeader from "@/ui/header/HomeHeader";
import ForgotPasswordForm from "@/ui/forgot-passoword/ForgotPasswordForm";
import styles from '@/app/forgot-password/forgot-password.module.css'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "recuperar contraseña",
};


export default function forgotPasswordPage() {
  return <>
    <HomeHeader dropDownOptions={[
      { label: 'Iniciar sesión', href: '/login' },
    ]} />
    <main className={styles.main}>
      <h2>Recuperar contraseña</h2>
      <div className={`${styles.card} col-12 col-sm-8 col-md-6 col-lg-5`}>
        <p>Si olvidaste tu contraseña, puedes restablecerla ingresando tu correo electrónico a continuación.</p>
        <p>Te enviaremos un enlace para restablecer tu contraseña.</p>
      </div>
      <ForgotPasswordForm />
    </main>
  </>
}