import { Artist, PagedData } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";

type ArtistTableProps = {
  readonly data: PagedData<Artist> | undefined;
};

export default async function ArtistTable({ data }: ArtistTableProps) {
  return <div>
    {(data?.content?.length ?? 0) > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Acciones</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((artist) => (
            <tr key={artist.id}>
              <td>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <CustomButton variant="tertiary" type="button">
                    <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                  </CustomButton>
                  <CustomButton variant="tertiary" type="button">
                    <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                  </CustomButton>
                </div>
              </td>
              <td>{artist.name}</td>
            </tr>
          ))}
        </tbody>
      </table>) : (
      <div className="error-message">
        <h2>¡No se encontraron resultados!</h2>
        <p>Registre un artista usando el botón Agregar o cambie los valores de su búsqueda</p>
      </div>)
    }
  </div>
}