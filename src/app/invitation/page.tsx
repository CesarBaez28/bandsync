import styles from "./invitation-page.module.css";
import acceptInvitation from "../lib/api/invitations";
import { AcceptInvitation, ApiResponse } from "../lib/definitions";
import { handleAsync } from "../lib/utils";
import CustomLink from "../ui/link-temporal/CustomLink";
import { Footer } from "../ui/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitación",
  description: "Página de invitación para unirse a una banda",
};


type Props = {
  readonly searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function InvitationPage(props: Props) {
  const { token } = (await props.searchParams) ?? {};

  const [response, error] = await handleAsync<ApiResponse<AcceptInvitation>>(
    acceptInvitation({ token })
  );

  const userExist = response?.data?.userExist ?? false;
  const bandName = response?.data?.bandName ?? '';
  const invitedUserEmail = response?.data?.email ?? '';

  return (
    <div className={styles.container}>
      <div className={styles.pageContainer}>
        <main className={styles.card}>

          {/* Error */}
          {error && (
            <div className={styles.messageError}>
              <h2>¡Lo sentimos!</h2>
              <p>
                Hubo un error al aceptar la invitación. El enlace puede ser
                inválido o haber expirado. Intente solicitar una nueva invitación.
              </p>
            </div>
          )}

          {/* Token válido */}
          {!error && (
            <div>

              <div className={styles.title}>
                <h2>Invitación a la banda</h2>
                <p>
                  La invitación a la banda <strong>{bandName}</strong> se ha procesado correctamente.
                </p>
              </div>

              {/* usuario existe */}
              {userExist && (
                <div className={styles.messageSuccess}>
                  <p style={{ marginBottom: '1rem' }}>
                    ¡Felicidades! Ya formas parte de la banda. Puedes acceder a tu
                    cuenta para continuar.
                  </p>

                  <CustomLink
                    href="/login"
                    style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-text)' }}
                    buttonStyle={true}
                  >
                    Iniciar sesión
                  </CustomLink>
                </div>
              )}

              {/* usuario NO existe */}
              {!userExist && (
                <div className={styles.messageInfo}>

                  <h3 style={{ marginBottom: '1rem' }}>Necesitas registrarte</h3>

                  <div className={styles.infoText}>
                    <p>
                      El correo <strong>{invitedUserEmail}</strong> no está registrado en nuestra plataforma.
                    </p>
                    <p>
                      Para unirte a la banda <strong>{bandName}</strong>, primero debes crear una cuenta.
                    </p>
                  </div>

                  <CustomLink
                    href={`/register?token=${token}`}
                    style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-text)' }}
                    buttonStyle={true}
                  >
                    Crear cuenta
                  </CustomLink>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
