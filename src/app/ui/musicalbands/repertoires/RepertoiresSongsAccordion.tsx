import stylesResponsive from '@/app/styles/responsive.module.css';
import Accordion from '../../accordion/Accordion';
import CustomLink from '../../link/CustomLink';
import LinkIcon from "@/public/link_24dp.svg";
import DocsIcon from "@/public/docs_24dp.svg";
import { Song } from '@/app/lib/definitions';


type Props = {
  readonly songs: Song[] | undefined;
}

export default function RepertoiresSongsAccordion({ songs }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {songs?.map((song) => (
        <Accordion
          key={song.id}
          header={(
            <div>
              <p>{song.name}</p>
            </div>
          )}
          actions={(
            <>
              <CustomLink href={song.link} variant="tertiary">
                <LinkIcon width={24} height={24} />
              </CustomLink>
              <CustomLink href={song.sheetMusic} variant="tertiary">
                <DocsIcon width={24} height={24} />
              </CustomLink>
            </>
          )}
        >
          <div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Tonalidad:</strong>
              <span>{song.tonality}</span>
            </div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Artista:</strong>
              <span>{song.artist.name}</span>
            </div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Género:</strong>
              <span>{song.genre.name}</span>
            </div>

          </div>
        </Accordion>
      ))}
    </div>
  );
}