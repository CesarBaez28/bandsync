import { getMusicalBandById } from "@/app/lib/api/musicalBands";
import { ApiResponse, MusicalBand } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import SettingsContent from "@/app/ui/musicalbands/settings/SettingsContent";
import { auth } from "@/auth";

type Props = {
  params: Promise<{ hypName: string; }>;
}

export default async function SettingsPage(props: Props) {
  const [session, { hypName }] = await Promise.all([auth(), props.params]);

  const musicalBand: MusicalBand | undefined = session?.user?.musicalBands.find(mb => mb.hyphenatedName === hypName);

  const [response, error] = await handleAsync<ApiResponse<MusicalBand>>(getMusicalBandById({ musicalBandId: musicalBand?.id }));

  return (
    <div>
      {error == null ? (
        <SettingsContent musicalBand={response?.data} />
      ) : (
        <div className="message">
          <h2>¡Lo sentimos!</h2>
          <p>
            Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.
          </p>
        </div>
      )}
    </div>
  )
}