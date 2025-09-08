import { Song } from "@/app/lib/definitions";
import Image from "next/image";
import React from "react";
import CustomButton from "../../button/CustomButton";

type Props = {
  readonly songs: Song[];
  readonly setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
}

export default function RepertoireSongsTable({ songs, setSongs }: Props) {

  const handleDelete = (song: Song) => {
    setSongs(songs.filter(s => s.id !== song.id));
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Acciones</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>
                <CustomButton onClick={() => handleDelete(song)} variant="tertiary" type="button">
                  <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                </CustomButton>
              </td>
              <td>{song.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}