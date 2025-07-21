import { getUserById } from "@/app/lib/api/users";
import { ApiResponse, User } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import ProfileContent from "@/app/ui/profile/ProfileContent";

export default async function ProfilePage() {
  const [response, error] = await handleAsync<ApiResponse<User>>(getUserById());

  return (
    <div>
      {error == null ? (
        <ProfileContent user={response?.data} />
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