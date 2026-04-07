import { getMusicalBandByHyphenatedName, getMusicalBandById } from "@/app/lib/api/musicalBands";
import { ApiResponse, MusicalBand } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import SettingsContent from "@/app/ui/musicalbands/settings/SettingsContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{ hypName: string; }>;
}

export const metadata: Metadata = {
  title: "Configuración",
  description: "Configuración",
};

export default async function SettingsPage(props: Props) {
  const { hypName } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

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