import stylesResponsive from '@/app/styles/responsive.module.css';
import { MusicalGenre, PagedData } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import Accordion from '../../accordion/Accordion';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import CustomButton from '../../button/CustomButton';
import EditIcon from "@/public/edit_24dp.svg";
import DeleteIcon from "@/public/delete_24dp.svg";

type Props = {
  readonly data: PagedData<MusicalGenre> | undefined;
  readonly musicalBandId?: UUID;
  readonly onEdit?: (musicalGenre: MusicalGenre) => void
  readonly onDelete?: (musicalGenre: MusicalGenre) => void
};

export default function MusicalGenresAccordion({ data, musicalBandId, onEdit, onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {data?.content.map((musicalGenre) => (
        <Accordion
          key={musicalGenre.id}
          header={(
            <div>
              <p>{musicalGenre.name}</p>
            </div>
          )}
          actions={(
            <Can anyOf={[UserPermissions.UPDATE_MUSICAL_GENRE, UserPermissions.DELETE_MUSICAL_GENRE]} musicalBandId={musicalBandId}>
              <Can permission={UserPermissions.UPDATE_MUSICAL_GENRE} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onEdit?.(musicalGenre)} variant="tertiary" type="button">
                  <EditIcon width={24} height={24} />
                </CustomButton>
              </Can>
              <Can permission={UserPermissions.DELETE_MUSICAL_GENRE} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onDelete?.(musicalGenre)} variant="tertiary" type="button">
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