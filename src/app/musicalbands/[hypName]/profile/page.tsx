import { getUserById } from "@/app/lib/api/users";
import { ApiResponse, User } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import ProfileContent from "@/app/ui/profile/ProfileContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Perfil",
};

type Props = {
  readonly params: Promise<{ hypName: string; }>;
}

export default async function ProfilePage(props: Props) {
  const { hypName } = await props.params;
  const [response, error] = await handleAsync<ApiResponse<User>>(getUserById());

  return (
    <div>
      {error == null ? (
        <ProfileContent user={response?.data} hypName={hypName} />
      ) : (
        <div className="message">
          <h2>¡Lo sentimos!</h2>
          <p>
            Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.
          </p>
        </div>
      )}
    </div>
  );
}