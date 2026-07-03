import stylesResponsive from '@/app/styles/responsive.module.css';
import { PagedData, Song } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import Accordion from '@/ui/accordion/Accordion';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import CustomLink from '../../link/CustomLink';
import CustomButton from '../../button/CustomButton';
import EditIcon from "@/public/edit_24dp.svg";
import DeleteIcon from "@/public/delete_24dp.svg";
import LinkIcon from "@/public/link_24dp.svg";
import DocsIcon from "@/public/docs_24dp.svg";

type Props = {
  readonly data: PagedData<Song> | undefined;
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
  readonly onDelete?: (repertoire: Song) => void;
};

export default function SongsAccordion({ data, musicalBandId, hypName, onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {data?.content.map((song) => (
        <Accordion
          key={song.id}
          header={(
            <div>
              <p>{song.name}</p>
            </div>
          )}
          actions={(
            <>
              <Can permission={UserPermissions.UPDATE_SONG} musicalBandId={musicalBandId}>
                <CustomLink href={`/musicalbands/${hypName}/songs/${song.id}/edit`} variant="tertiary">
                  <EditIcon width={24} height={24} />
                </CustomLink>
              </Can>
              <Can permission={UserPermissions.DELETE_SONG} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onDelete?.(song)} variant="tertiary" type="button">
                  <DeleteIcon width={24} height={24} />
                </CustomButton>
              </Can>
              <CustomLink href={song.link} variant="tertiary" newTab>
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
  )
}