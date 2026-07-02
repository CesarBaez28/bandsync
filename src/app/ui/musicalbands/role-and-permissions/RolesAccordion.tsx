import stylesResponsive from '@/app/styles/responsive.module.css';
import Accordion from '../../accordion/Accordion';
import { Can } from '../../authorization/Can';
import CustomButton from '../../button/CustomButton';
import { UserPermissions } from '@/app/lib/permisions';
import EditIcon from '@/public/edit_24dp.svg'
import DeleteIcon from '@/public/delete_24dp.svg'
import { UUID } from 'node:crypto';
import { RoleAndPermissions, UserRolesAndPermissions } from '@/app/lib/definitions';

type Props = {
  readonly musicalBandId: UUID | undefined;
  readonly rolesAndPermissions: RoleAndPermissions[] | undefined;
  readonly currentUserRole: UserRolesAndPermissions | null
  readonly onEdit?: (roleAndPermission: RoleAndPermissions) => void;
  readonly onDelete?: (roleAndPermission: RoleAndPermissions) => void;
};

export default function RolesAccordion({
  musicalBandId,
  rolesAndPermissions,
  currentUserRole,
  onEdit,
  onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {rolesAndPermissions?.map((roleAndPermission) => (
        <Accordion
          key={roleAndPermission.role.id}
          header={(
            <div>
              <p>{roleAndPermission.role.name}</p>
            </div>
          )}
          actions={(
            <Can anyOf={[UserPermissions.UPDATE_ROLE, UserPermissions.DELETE_ROLE]} musicalBandId={musicalBandId}>
              <Can permission={UserPermissions.UPDATE_ROLE} musicalBandId={musicalBandId}>
                <CustomButton
                  disabled={currentUserRole?.role.id === roleAndPermission.role.id}
                  onClick={() => onEdit?.(roleAndPermission)}
                  variant="tertiary"
                >
                  <EditIcon width={24} height={24} />
                </CustomButton>
              </Can>
              <Can permission={UserPermissions.DELETE_ROLE} musicalBandId={musicalBandId}>
                <CustomButton
                  disabled={currentUserRole?.role.id === roleAndPermission.role.id}
                  onClick={() => onDelete?.(roleAndPermission)}
                  variant="tertiary" type="button"
                >
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