import getAllPermissions from '@/app/lib/api/permissions';
import styles from './roles-and-permissions.module.css'
import { getMusicalBandByHyphenatedName } from "@/app/lib/api/musicalBands";
import { getRolesAndPermissionsByMusicalBandId } from "@/app/lib/api/roles";
import { ApiResponse, RoleAndPermissions, Permission, TypeOfPermission } from "@/app/lib/definitions";
import { handleAsync } from "@/app/lib/utils";
import RolesContent from '@/app/ui/musicalbands/role-and-permissions/RolesContent';
import getAllTypesOfPermissions from '@/app/lib/api/typeOfPermissions';

type PageProps = {
  params: Promise<{ hypName: string; }>;
}

export default async function RolesAndPermissionsPage(props: PageProps) {
  const { hypName } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [[rolesAndPermissions, rolesAndPermissionsError], [permissions, permissionsError], [typeOfPermissions, typeOfPermissionsError]] = await Promise.all([
    handleAsync<ApiResponse<RoleAndPermissions[]>>(getRolesAndPermissionsByMusicalBandId({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<Permission[]>>(getAllPermissions({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<TypeOfPermission[]>>(getAllTypesOfPermissions({ musicalBandId: musicalBand?.id })),
  ]);

  return (
    <div>
      <h2>Roles y Permisos</h2>

      <main className={styles.mainContainer}>
        {rolesAndPermissionsError || permissionsError || typeOfPermissionsError
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : (
            <RolesContent
              hypName={hypName}
              musicalBandId={musicalBand?.id}
              rolesAndPermissions={rolesAndPermissions.data}
              permissions={permissions.data}
              typeOfPermissions={typeOfPermissions.data}
            />
          )
        }
      </main>

    </div>
  );
}