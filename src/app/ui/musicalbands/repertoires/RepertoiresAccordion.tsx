import stylesResponsive from '@/app/styles/responsive.module.css';
import { PagedData, Repertoire } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import Accordion from '../../accordion/Accordion';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import CustomLink from '../../link/CustomLink';
import EditIcon from '@/public/edit_24dp.svg';
import DeleteIcon from '@/public/delete_24dp.svg';
import CustomButton from '../../button/CustomButton';
import LinkIcon from '@/public/link_24dp.svg'
import SeeIcon from '@/public/opsz24.svg'

type Props = {
  readonly data: PagedData<Repertoire> | undefined;
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
  readonly onDelete?: (repertoire: Repertoire) => void;
}

export default function RepertoiresAccordion({ data, musicalBandId, hypName, onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {data?.content?.map((repertoire) => (
        <Accordion
          key={repertoire.id}
          header={(
            <div>
              <p>{repertoire.name}</p>
            </div>
          )}
          actions={(
            <>
              <Can permission={UserPermissions.UPDATE_REPERTOIRE} musicalBandId={musicalBandId}>
                <CustomLink href={`/musicalbands/${hypName}/repertoires/${repertoire.id}/edit`} variant="tertiary">
                  <EditIcon width={24} height={24} />
                </CustomLink>
              </Can>
              <Can permission={UserPermissions.DELETE_REPERTOIRE} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onDelete?.(repertoire)} variant="tertiary" type="button">
                  <DeleteIcon width={24} height={24} />
                </CustomButton>
              </Can>
              <CustomLink href={repertoire.link} variant="tertiary" newTab>
                <LinkIcon width={24} height={24} />
              </CustomLink>
              <CustomLink href={`/musicalbands/${hypName}/repertoires/${repertoire.id}/see`} variant="tertiary">
                <SeeIcon width={24} height={24} />
              </CustomLink>
            </>
          )}
        >
          <div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Descripción:</strong>
              <span>{repertoire.description || "No hay descripción disponible"}</span>
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  );
}