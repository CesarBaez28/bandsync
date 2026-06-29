import stylesResponsive from '@/app/styles/responsive.module.css';
import { MusicalRole, PagedData } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import Accordion from '../../accordion/Accordion';
import { Can } from '../../authorization/Can';
import CustomButton from '../../button/CustomButton';
import EditIcon from "@/public/edit_24dp.svg";
import DeleteIcon from "@/public/delete_24dp.svg";
import { UserPermissions } from '@/app/lib/permisions';

type Props = {
  readonly data: PagedData<MusicalRole> | undefined;
  readonly musicalBandId?: UUID;
  readonly onEdit?: (role: MusicalRole) => void;
  readonly onDelete?: (role: MusicalRole) => void;
}

export default function MusicalRolesAccordion({ data, musicalBandId, onEdit, onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {data?.content.map((role) => (
        <Accordion
          key={role.id}
          header={(
            <div>
              <p>{role.name}</p>
            </div>
          )}
          actions={(
            <Can anyOf={[UserPermissions.UPDATE_MUSICAL_ROLE, UserPermissions.DELETE_MUSICAL_ROLE]} musicalBandId={musicalBandId}>
              <Can permission={UserPermissions.UPDATE_MUSICAL_ROLE} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onEdit?.(role)} variant="tertiary" type="button">
                  <EditIcon width={24} height={24} />
                </CustomButton>
              </Can>
              <Can permission={UserPermissions.DELETE_MUSICAL_ROLE} musicalBandId={musicalBandId}>
                <CustomButton onClick={() => onDelete?.(role)} variant="tertiary" type="button">
                  <DeleteIcon width={24} height={24} />
                </CustomButton>
              </Can>
            </Can>
          )}
        >
        </Accordion>
      ))}
    </div>
  );
}