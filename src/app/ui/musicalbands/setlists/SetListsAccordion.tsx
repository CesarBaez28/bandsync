import stylesResponsive from '@/app/styles/responsive.module.css';
import { PagedData, Setlist } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import Accordion from '@/ui/accordion/Accordion';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import CustomLink from '../../link/CustomLink';
import CustomButton from '../../button/CustomButton';
import EditIcon from "@/public/edit_24dp.svg";
import DeleteIcon from "@/public/delete_24dp.svg";
import { formatDate } from '@/app/lib/utils';

type Props = {
  readonly data: PagedData<Setlist> | undefined;
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
  readonly onDelete?: (repertoire: Setlist) => void;
};

export default function SetListsAccordion({ data, musicalBandId, hypName, onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {data?.content.map((setlist) => (
        <Accordion
          key={setlist.id}
          header={(
            <div>
              <p>{setlist.name}</p>
            </div>
          )}
          actions={(
            <>
              <Can permission={UserPermissions.UPDATE_SONG} musicalBandId={musicalBandId}>
                <CustomLink href={`/musicalbands/${hypName}/songs/${setlist.id}/edit`} variant="tertiary">
                  <EditIcon width={24} height={24} />
                </CustomLink>
              </Can>
              <Can permission={UserPermissions.DELETE_SONG} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onDelete?.(setlist)} variant="tertiary" type="button">
                  <DeleteIcon width={24} height={24} />
                </CustomButton>
              </Can>
            </>
          )}
        >
          <div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Nombre:</strong>
              <span>{setlist.name}</span>
            </div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Descripción:</strong>
              <span>{setlist.description}</span>
            </div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Repertorio:</strong>
              <span>{setlist.repertoire.name}</span>
            </div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Fecha de creación:</strong>
              <span>{formatDate(new Date(setlist.createdAt))}</span>
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  )
}