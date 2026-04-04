import { getUserById } from "@/app/lib/api/users";
import { ApiResponse, User } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import TwoFactorOptions from "@/app/ui/two-factor/2FAOptions";

type Props = {
  readonly params: Promise<{ hypName: string; }>;
}

export default async function TwoFactorPage({ params }: Props) {
  const [[response, error], { hypName }] = await Promise.all([
    handleAsync<ApiResponse<User>>(getUserById()),
    params
  ]);

  const is2FAEnabled = response?.data?.is2FAEnabled || false;

  return (
    <main className="mainContent">
      {error == null ? (
        <TwoFactorOptions hypName={hypName} is2FAEnabled={is2FAEnabled} />
      ) : (
        <div className="message">
          <h2>¡Lo sentimos!</h2>
          <p>
            Hubo un error inesperado. Intente refrescar la página o vuelva a visitar la página más tarde.
          </p>
        </div>
      )}
    </main>
  );
}