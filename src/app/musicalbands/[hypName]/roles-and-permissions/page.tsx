import getAllPermissions from '@/app/lib/api/permissions';
import styles from './roles-and-permissions.module.css'
import { getMusicalBandByHyphenatedName } from "@/app/lib/api/musicalBands";
import { getRolesAndPermissionsByMusicalBandId, getUsersRoles } from "@/app/lib/api/roles";
import { ApiResponse, RoleAndPermissions, Permission, TypeOfPermission, UserRole, Role} from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import RolesContent from '@/app/ui/musicalbands/role-and-permissions/RolesContent';
import getAllTypesOfPermissions from '@/app/lib/api/typeOfPermissions';
import UsersRolesContent from '@/app/ui/musicalbands/role-and-permissions/UsersRoles';
import Tabs from '@/app/ui/tabs/Tabs';
import { auth } from '@/auth';

type PageProps = {
  params: Promise<{ hypName: string; }>;
}

export default async function RolesAndPermissionsPage(props: PageProps) {
  const [{ hypName }, sessions] = await Promise.all([
    props.params,
    auth()
  ])

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [
    [rolesAndPermissions, rolesAndPermissionsError],
    [permissions, permissionsError],
    [typeOfPermissions, typeOfPermissionsError],
    [usersRoles, usersRolesError]
  ] = await Promise.all([
    handleAsync<ApiResponse<RoleAndPermissions[]>>(getRolesAndPermissionsByMusicalBandId({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<Permission[]>>(getAllPermissions({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<TypeOfPermission[]>>(getAllTypesOfPermissions({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<UserRole[]>>(getUsersRoles({ musicalBandId: musicalBand?.id }))
  ]);

  const roles: Role[] | undefined = rolesAndPermissions?.data?.map(rp => rp.role);
  const currentUserId = sessions?.user.id;

  const tabs = [
    {
      key: 'roles',
      label: 'Roles',
      content: <RolesContent
        hypName={hypName}
        musicalBandId={musicalBand?.id}
        rolesAndPermissions={rolesAndPermissions?.data}
        permissions={permissions?.data}
        typeOfPermissions={typeOfPermissions?.data}
      />,
    },
    {
      key: 'assign',
      label: 'Asignar Roles',
      content: <UsersRolesContent
        currentUserId={currentUserId}
        usersRoles={usersRoles?.data}
        roles={roles}
        musicalBandId={musicalBand?.id}
        hypName={hypName}
      />
      ,
    },
  ];

  return (
    <div>
      <h2>Roles y Permisos</h2>

      <main className={styles.mainContainer}>
        {rolesAndPermissionsError || permissionsError || typeOfPermissionsError || usersRolesError
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <Tabs tabs={tabs} />
          )
        }
      </main>

    </div>
  );
}