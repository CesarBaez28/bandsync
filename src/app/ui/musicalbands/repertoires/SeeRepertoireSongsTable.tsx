import { Song } from "@/app/lib/definitions";
import CustomLink from "../../link-temporal/CustomLink";
import LinkIcon from "@/public/link_24dp.svg";
import DocsIcon from "@/public/docs_24dp.svg";

type Props = {
  readonly songs: Song[] | undefined;
}

export default function RepertoireSongsTable({ songs }: Props) {

  return (
    <div>
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
          {songs?.map((song) => (
            <tr key={song.id}>
              <td style={{ display: 'flex', gap: '.6rem' }}>
                <CustomLink href={song.link} variant="tertiary">
                  <LinkIcon width={24} height={24} />
                </CustomLink>
                <CustomLink href={song.sheetMusic} variant="tertiary">
                  <DocsIcon width={24} height={24} />
                </CustomLink>
              </td>
              <td>{song.name}</td>
              <td>{song.artist.name}</td>
              <td>{song.genre.name}</td>
              <td>{song.tonality}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}