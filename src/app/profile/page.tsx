import Image from "next/image";
import { signOutAction } from "../lib/actions/auth";
import CustomButton from "../ui/button/CustomButton";
import DropdownMenu from "../ui/dropdown/DropdownMenu";
import Header from "../ui/header/Header";
import ProfileContent from "../ui/profile/ProfileContent";
import { ApiResponse, User } from "../lib/definitions";
import { handleAsync } from "../lib/utils";
import { getUserById } from "../lib/api/users";
import styles from './profile.module.css';

export default async function Profile() {
  const [response, error] = await handleAsync<ApiResponse<User>>(getUserById());

  return (
    <div>
      <Header>
        <h2>BandSync</h2>
        <div>
          <DropdownMenu
            trigger={
              <CustomButton variant="secondary" style={{ padding: '0.4rem' }}>
                <Image src="/person_24dp.svg" alt="perfil" width={24} height={24} />
              </CustomButton>
            }
            options={[
              { label: 'Inicio', href: '/' },
              { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
            ]}
          />
        </div>
      </Header>
      {error == null
        ? <main className={styles.main}> <ProfileContent user={response?.data} /> </main> 
        : <div className="error-message">
          <h2>¡Lo sentimos!</h2>
          <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
        </div>
      }
    </div>
  )
}