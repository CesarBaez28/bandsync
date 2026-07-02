import stylesResponsive from '@/app/styles/responsive.module.css';
import { UUID } from "node:crypto";
import Accordion from '../../accordion/Accordion';
import { Can } from '../../authorization/Can';
import CustomButton from '../../button/CustomButton';
import EditIcon from '@/public/edit_24dp.svg'
import DeleteIcon from '@/public/delete_24dp.svg'
import { UserPermissions } from '@/app/lib/permisions';
import { UserRole, UserRolesAndPermissions } from '@/app/lib/definitions';

type Props = {
  readonly currentUserRole: UserRolesAndPermissions | null
  readonly currentUserId: UUID | undefined
  readonly usersRoles: UserRole[] | undefined
  readonly musicalBandId: UUID | undefined;
  readonly onEdit?: (userRole: UserRole) => void;
  readonly onDelete?: (userRole: UserRole) => void;
};

export default function UsersRolesAccordion({ currentUserRole, currentUserId, usersRoles, musicalBandId, onEdit, onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {usersRoles?.map((userRole) => (
        <Accordion
          key={userRole.user.id}
          header={(
            <div>
              <p>{userRole.user.username}</p>
              <p>{userRole.role.name}</p>
            </div>
          )}
          actions={(
            <Can anyOf={[UserPermissions.ASSIGN_ROLE]} musicalBandId={musicalBandId}>
              <CustomButton
                onClick={() => onEdit?.(userRole)}
                disabled={currentUserRole?.role.id === userRole.role.id && userRole.user.id === currentUserId}
                variant="tertiary"
              >
                <EditIcon width={24} height={24} />
              </CustomButton>
              <CustomButton
                disabled={currentUserRole?.role.id === userRole.role.id && userRole.user.id === currentUserId}
                variant='tertiary'
                onClick={() => onDelete?.(userRole)}
              >
                <DeleteIcon width={24} height={24} />
              </CustomButton>

            </Can>
          )}
        >
        </Accordion>
      ))}
    </div>
  )
}