import styles from './profile.module.css';
import { Metadata } from "next";
import HomeHeader from "@/app/ui/header/HomeHeader";
import { handleAsync } from '@/app/lib/utils';
import { getUserById } from '@/app/lib/api/users';
import { signOutAction } from '@/app/lib/actions/auth';
import { ApiResponse, User } from '@/app/lib/definitions';
import ProfileContent from '@/app/ui/profile/ProfileContent';

export const metadata: Metadata = {
  title: "Perfil",
  description: "Perfil",
};

export default async function Profile() {
  const [response, error] = await handleAsync<ApiResponse<User>>(getUserById());

  return (
    <div>
      <HomeHeader dropDownOptions={[
        { label: 'Inicio', href: '/' },
        { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
      ]} />

      {error == null
        ? <main className={styles.main}> <ProfileContent user={response?.data} /> </main>
        : <div className="message">
          <h2>¡Lo sentimos!</h2>
          <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
        </div>
      }
    </div>
  )
}