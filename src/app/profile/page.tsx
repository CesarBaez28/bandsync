import { signOutAction } from "../lib/actions/auth";
import ProfileContent from "../ui/profile/ProfileContent";
import { ApiResponse, User } from "../lib/definitions";
import { handleAsync } from "../lib/utils";
import { getUserById } from "../lib/api/users";
import styles from './profile.module.css';
import { Metadata } from "next";
import HomeHeader from "../ui/header/HomeHeader";

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