'use client';

import { PagedData, Song } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";
import CustomLink from "../../link/CustomLink";

type SongsTableProps = {
  readonly data: PagedData<Song> | undefined;
  readonly hypName: string
};

export default function SongsTable({ data, hypName }: SongsTableProps) {

  const handleDelete = ({ id, name, artist, genre, tonality, link, sheetMusic }: Song) => {
    //TODO: Finish to implement this function
    console.log(id);
  }

  return (
    <div id="modal-root">
      {(data?.content?.length ?? 0) > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Nombre</th>
              <th>Artista</th>
              <th>Género</th>
              <th>Tonalidad</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((song) => (
              <tr key={song.id}>
                <td>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <CustomLink href={`/musicalbands/${hypName}/songs/${song.id}/edit`} variant="tertiary">
                      <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                    </CustomLink>
                    <CustomButton onClick={() => handleDelete(song)} variant="tertiary" type="button">
                      <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                    </CustomButton>
                    <CustomLink href={song.link} variant="tertiary">
                      <Image src="/link_24dp.svg" alt="Editar" width={24} height={24} />
                    </CustomLink>
                    <CustomLink href={song.sheetMusic} variant="tertiary">
                      <Image src="/docs_24dp.svg" alt="Editar" width={24} height={24} />
                    </CustomLink>
                  </div>
                </td>
                <td>{song.name}</td>
                <td>{song.artist.name}</td>
                <td>{song.genre.name}</td>
                <td>{song.tonality}</td>
              </tr>
            ))}
          </tbody>
        </table>) : (
        <div className="message">
          <h2>¡No se encontraron resultados!</h2>
          <p>Registre una canción usando el botón Agregar o cambie los valores de su búsqueda</p>
        </div>)
      }
    </div>
  );
}