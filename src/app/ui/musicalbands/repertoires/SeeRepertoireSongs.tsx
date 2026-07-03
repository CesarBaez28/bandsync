import stylesResponsive from '@/app/styles/responsive.module.css';
import { Song } from "@/app/lib/definitions";
import CustomLink from "../../link/CustomLink";
import LinkIcon from "@/public/link_24dp.svg";
import DocsIcon from "@/public/docs_24dp.svg";
import RepertoiresSongsAccordion from './RepertoiresSongsAccordion';

type Props = {
  readonly songs: Song[] | undefined;
}

export default function RepertoireSongs({ songs }: Props) {

  return (
    <>
      <div className={stylesResponsive.desktopOnly}>
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
                <td>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <CustomLink href={song.link} variant="tertiary" newTab>
                      <LinkIcon width={24} height={24} />
                    </CustomLink>
                    <CustomLink href={song.sheetMusic} variant="tertiary">
                      <DocsIcon width={24} height={24} />
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
        </table>
      </div>

      <div className={stylesResponsive.mobileOnly}>
        <RepertoiresSongsAccordion songs={songs} />
      </div>
    </>
  )
}