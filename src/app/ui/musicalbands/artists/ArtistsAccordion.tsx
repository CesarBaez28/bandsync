import stylesResponsive from '@/app/styles/responsive.module.css';
import { Artist, PagedData } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import CustomButton from '../../button/CustomButton';
import EditIcon from "@/public/edit_24dp.svg";
import DeleteIcon from "@/public/delete_24dp.svg";
import Accordion from '../../accordion/Accordion';

type Props = {
  readonly data: PagedData<Artist> | undefined;
  readonly musicalBandId?: UUID;
  readonly onEdit?: (artist: Artist) => void
  readonly onDelete?: (artist: Artist) => void
};

export default function ArtistsAccordion({ data, musicalBandId, onEdit, onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {data?.content.map((artist) => (
        <Accordion
          key={artist.id}
          header={(
            <div>
              <p>{artist.name}</p>
            </div>
          )}
          actions={(
            <Can anyOf={[UserPermissions.DELETE_ARTIST, UserPermissions.UPDATE_ARTIST]} musicalBandId={musicalBandId}>
              <Can permission={UserPermissions.UPDATE_ARTIST} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onEdit?.(artist)} variant="tertiary" type="button">
                  <EditIcon width={24} height={24} />
                </CustomButton>
              </Can>
              <Can permission={UserPermissions.DELETE_ARTIST} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onDelete?.(artist)} variant="tertiary" type="button">
                  <DeleteIcon width={24} height={24} />
                </CustomButton>
              </Can>
            </Can>
          )}
        >
        </Accordion>
      ))}
    </div>
  )
}