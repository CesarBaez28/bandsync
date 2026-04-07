'use client';

import styles from './roles-content.module.css';
import stylesForm from '../../../styles/form.module.css';
import stylesModal from '../../../styles/modal.module.css'
import CustomButton from "../../button/CustomButton";
import { UUID } from 'node:crypto';
import { Permission, RoleAndPermissions, TypeOfPermission, UserRolesAndPermissions } from '@/app/lib/definitions';
import { ChangeEvent, startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import Modal from '../../modal/Modal';
import CustomInput from '../../inputs/CustomInput';
import { roleSchema, RoleSchema } from '@/app/lib/schemas/roleSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createRoleAction, deleteRoleAction, RoleState, RoleStateDelete, updateRoleAction } from '@/app/lib/actions/roles';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast/ToastContext';
import { usePermissions } from '@/app/lib/customHooks/usePermissions';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import EditIcon from '@/public/edit_24dp.svg'
import DeleteIcon from '@/public/delete_24dp.svg'

type Props = {
  readonly hypName: string;
  readonly musicalBandId: UUID | undefined;
  readonly rolesAndPermissions: RoleAndPermissions[] | undefined;
  readonly permissions: Permission[] | undefined;
  readonly typeOfPermissions: TypeOfPermission[] | undefined;
};

export default function RolesContent({ hypName, musicalBandId, rolesAndPermissions, permissions, typeOfPermissions }: Props) {
  const { userRolesAndPermissions } = usePermissions();
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedRoleAndPermissions, setSelectedRoleAndPermissions] = useState<RoleAndPermissions | null>(null);
  const initialStateCreate: RoleState = { errors: {}, message: null, success: false };
  const [stateCreate, formActionCreate, isPendingCreate] = useActionState<RoleState, FormData>(createRoleAction, initialStateCreate);
  const initialStateEdit: RoleState = { errors: {}, message: null, success: false };
  const [stateEdit, formActionEdit, isPendingEdit] = useActionState<RoleState, FormData>(updateRoleAction, initialStateEdit);
  const initialDeleteState: RoleStateDelete = { errors: {}, message: null, success: false, data: undefined };
  const [stateDelete, formActionDelete, isDeletingPending] = useActionState<RoleStateDelete, FormData>(deleteRoleAction, initialDeleteState);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRolesAndPermissions | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const formRefEdit = useRef<HTMLFormElement>(null);
  const formRefCreate = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const currentRole = userRolesAndPermissions.find((ur) => ur.musicalBand.id === musicalBandId);
    if (currentRole) {
      setCurrentUserRole(currentRole);
    }
  }, [userRolesAndPermissions, musicalBandId])

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit }
  } = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    mode: "onChange",
  });

  const onSubmitEdit = () => {
    if (!formRefEdit.current) return;

    const fd = new FormData(formRefEdit.current);

    startTransition(() => {
      formActionEdit(fd);
    });
  }

  const handleCancelEdit = useCallback(() => {
    resetEdit();
    formRefEdit.current?.reset();
    stateEdit.errors = {};
    stateEdit.message = null;
    setOpenUpdateModal(false);
    setSelectedRoleAndPermissions(null);
  }, [resetEdit, stateEdit]);

  useEffect(() => {
    if (stateEdit.success) {
      handleCancelEdit();
      showToast('Role actualizado correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/roles-and-permissions`);
    }
  }, [handleCancelEdit, stateEdit.success, showToast, hypName, router]);

  const handleEditRole = (roleAndPermissions: RoleAndPermissions) => {
    setValueEdit("name", roleAndPermissions.role.name);
    setSelectedRoleAndPermissions(roleAndPermissions);
    setOpenUpdateModal(true);
  }

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    mode: "onChange",
  });

  const handleCreateCancel = useCallback(() => {
    resetCreate();
    formRefCreate.current?.reset();
    stateCreate.message = null;
    stateCreate.errors = {}
    setOpenCreateModal(false);
    setSelectedRoleAndPermissions(null);
  }, [setOpenCreateModal, resetCreate, stateCreate]);

  useEffect(() => {
    if (stateCreate.success) {
      handleCreateCancel();
      showToast('Role creado correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/roles-and-permissions`);
    }
  }, [handleCreateCancel, stateCreate.success, showToast, hypName, router]);

  const handleCreate = () => {
    setSelectedRoleAndPermissions({
      role: { id: 0, name: '', status: false },
      permissions: [],
    });
    setOpenCreateModal(true);
  }

  const onSubmitCreate = () => {
    if (!formRefCreate.current) return;

    const fd = new FormData(formRefCreate.current);

    startTransition(() => {
      formActionCreate(fd);
    });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = (roleAndPermissions: RoleAndPermissions) => {
    setOpenDeleteModal(true);
    setSelectedRoleAndPermissions(roleAndPermissions);
  }

  const handleDeleteCancel = useCallback(() => {
    stateDelete.errors = {};
    stateDelete.message = null;
    stateDelete.success = false;
    stateDelete.data = undefined;
    setOpenDeleteModal(false);
    setSelectedRoleAndPermissions(null);
  }, [stateDelete])

  useEffect(() => {
    if (stateDelete?.success) {
      handleDeleteCancel();
      showToast("Role eliminado correctamente!", 'success')
      router.push(`/musicalbands/${hypName}/roles-and-permissions`);
    }
  }, [stateDelete.success, showToast, router, hypName, handleDeleteCancel])

  const handlePermissionToggle = (permission: Permission) => {
    if (!selectedRoleAndPermissions) return;

    const exists = permissionIsPresentInRole(selectedRoleAndPermissions.permissions, permission);

    const updatedPermissions = exists
      ? selectedRoleAndPermissions.permissions.filter(p => p.id !== permission.id)
      : [...(selectedRoleAndPermissions.permissions || []), permission];

    setSelectedRoleAndPermissions({
      ...selectedRoleAndPermissions,
      permissions: updatedPermissions
    });
  };

  const handleChangeSelectAllPermissions = (event: ChangeEvent<HTMLInputElement>) => {
    if (!selectedRoleAndPermissions || !permissions) return;

    const { checked } = event.target;

    const updatedRoleAndPermissions: RoleAndPermissions = {
      ...selectedRoleAndPermissions,
      permissions: checked ? [...permissions] : []
    };

    setSelectedRoleAndPermissions(updatedRoleAndPermissions);
  };

  const handleChangeSelectAllByType = (typeId: number, checked: boolean) => {
    if (!selectedRoleAndPermissions || !permissions) return;

    const typePermissions = permissions.filter(p => p.typeOfPermission.id === typeId);
    const currentPermissions = selectedRoleAndPermissions.permissions || [];

    const updatedPermissions = checked
      ? [
        ...currentPermissions.filter(p => p.typeOfPermission.id !== typeId),
        ...typePermissions
      ]
      : currentPermissions.filter(p => p.typeOfPermission.id !== typeId);

    setSelectedRoleAndPermissions({
      ...selectedRoleAndPermissions,
      permissions: updatedPermissions
    });
  };

  return (
    <div id='modal-root'>

      <Can permission={UserPermissions.ADD_ROLE} musicalBandId={musicalBandId}>
        <CustomButton style={{ marginBottom: '1rem' }} onClick={handleCreate}>
          Crear Role
        </CustomButton>
      </Can>

      <section>
        <table>
          <thead>
            <tr>
              <Can anyOf={[UserPermissions.UPDATE_ROLE, UserPermissions.DELETE_ROLE]} musicalBandId={musicalBandId}>
                <th>Acciones</th>
              </Can>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {rolesAndPermissions?.map((roleAndPermission) => (
              <tr key={roleAndPermission.role.id}>
                <Can anyOf={[UserPermissions.UPDATE_ROLE, UserPermissions.DELETE_ROLE]} musicalBandId={musicalBandId}>
                  <td>
                    <div style={{ display: 'flex', gap: '.6rem' }}>
                      <Can permission={UserPermissions.UPDATE_ROLE} musicalBandId={musicalBandId}>
                        <CustomButton disabled={currentUserRole?.role.id === roleAndPermission.role.id} onClick={() => handleEditRole(roleAndPermission)} variant="tertiary">
                          <EditIcon width={24} height={24} />
                        </CustomButton>
                      </Can>
                      <Can permission={UserPermissions.DELETE_ROLE} musicalBandId={musicalBandId}>
                        <CustomButton disabled={currentUserRole?.role.id === roleAndPermission.role.id} onClick={() => handleDelete(roleAndPermission)} variant="tertiary" type="button">
                          <DeleteIcon width={24} height={24} />
                        </CustomButton>
                      </Can>
                    </div>
                  </td>
                </Can>
                <td>{roleAndPermission.role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </section>

      <Modal
        size={isMobile ? "sm" : "md"}
        isOpen={openCreateModal}
        title="Crear Rol"
      >
        <form
          ref={formRefCreate}
          action={formActionCreate}
          onSubmit={handleSubmitCreate(onSubmitCreate)}
          className={styles.formContainer}
        >
          <div className={styles.permissionsList}>

            <CustomInput
              label='Nombre:'
              type='text'
              {...registerCreate("name")}
              error={errorsCreate.name}
            />

            {stateCreate?.message && (
              <p className={stylesForm.errorMessage}>
                {stateCreate?.message}
              </p>
            )}

            <input type="hidden" name="musicalBandId" value={musicalBandId} />
            <input type="hidden" name="permissions" value={selectedRoleAndPermissions?.permissions.map(permission => permission.id).toString()} />

            <PermissionsContent
              permissions={permissions}
              typeOfPermissions={typeOfPermissions}
              selectedRoleAndPermissions={selectedRoleAndPermissions}
              handleChangeSelectAllByType={handleChangeSelectAllByType}
              handlePermissionToggle={handlePermissionToggle}
              handleChangeSelectAllPermissions={handleChangeSelectAllPermissions}
            />

          </div>

          <div className={styles.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleCreateCancel}>
              Cancelar
            </CustomButton>
            <CustomButton isLoading={isPendingCreate} type='submit'>
              Guardar
            </CustomButton>
          </div>
        </form>
      </Modal>

      <Modal
        size={isMobile ? "sm" : "md"}
        isOpen={openUpdateModal}
        title="Editar Rol"
      >
        <form
          ref={formRefEdit}
          action={formActionEdit}
          onSubmit={handleSubmitEdit(onSubmitEdit)}
          className={styles.formContainer}
        >
          <div className={styles.permissionsList}>

            <CustomInput
              label='Nombre:'
              type='text'
              {...registerEdit("name")}
              error={errorsEdit.name}
            />

            {stateEdit?.message && (
              <p className={stylesForm.errorMessage}>
                {stateEdit?.message}
              </p>
            )}

            <input type="hidden" name="musicalBandId" value={musicalBandId} />
            <input type="hidden" name="roleId" value={selectedRoleAndPermissions?.role.id} />
            <input type="hidden" name="permissions" value={selectedRoleAndPermissions?.permissions.map(permission => permission.id).toString()} />

            <PermissionsContent
              permissions={permissions}
              typeOfPermissions={typeOfPermissions}
              selectedRoleAndPermissions={selectedRoleAndPermissions}
              handleChangeSelectAllByType={handleChangeSelectAllByType}
              handlePermissionToggle={handlePermissionToggle}
              handleChangeSelectAllPermissions={handleChangeSelectAllPermissions}
            />

          </div>

          <div className={styles.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleCancelEdit}>
              Cancelar
            </CustomButton>
            <CustomButton isLoading={isPendingEdit} type='submit'>
              Guardar
            </CustomButton>
          </div>
        </form>
      </Modal>

      <Modal
        size="sm"
        isOpen={openDeleteModal}
        title="Eliminar Canción"
      >
        <form action={formActionDelete} className={stylesModal.modalContent}>

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          {stateDelete?.message && (
            <p className={stylesForm.errorMessage}>
              {stateDelete?.message}
            </p>
          )}

          {(stateDelete?.data?.length ?? 0) > 0 && (
            <>
              <p>
                Por favor, cambie el role de los siguientes usuarios antes de eliminar:
              </p>
              <div>
                {stateDelete.data?.map((user) => (
                  <p key={user.id}>{user.firstName}</p>
                ))}
              </div>
            </>
          )}

          <input type="hidden" name="roleId" value={selectedRoleAndPermissions?.role.id} />
          <input type="hidden" name="musicalBandId" value={musicalBandId} />

          <div className={stylesModal.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleDeleteCancel}>
              Cancelar
            </CustomButton>
            <CustomButton isLoading={isDeletingPending} type='submit'>
              Eliminar
            </CustomButton>
          </div>
        </form>
      </Modal>

    </div>
  );
}

type PermissionsContentProps = {
  readonly permissions: Permission[] | undefined;
  readonly typeOfPermissions: TypeOfPermission[] | undefined;
  readonly selectedRoleAndPermissions: RoleAndPermissions | null;
  readonly handleChangeSelectAllByType: (typeId: number, checked: boolean) => void;
  readonly handlePermissionToggle: (permission: Permission) => void;
  readonly handleChangeSelectAllPermissions: (event: ChangeEvent<HTMLInputElement>) => void;
};

function PermissionsContent({
  permissions,
  typeOfPermissions,
  selectedRoleAndPermissions,
  handleChangeSelectAllByType,
  handlePermissionToggle,
  handleChangeSelectAllPermissions,
}: PermissionsContentProps) {
  return (
    <>
      <div className={styles.selectAllPermissions}>
        <input
          className={styles.permissionCheckbox}
          type="checkbox"
          id={`permission-all`}
          name={`permission-all`}
          onChange={(e) => handleChangeSelectAllPermissions(e)}
          defaultChecked={permissions?.length === selectedRoleAndPermissions?.permissions.length}
        />
        <label htmlFor={`permission-all`}><strong>Seleccionar todos</strong></label>
      </div>

      {typeOfPermissions?.map((typeOfPermission) => {
        const typePerms = permissions?.filter(p => p.typeOfPermission.id === typeOfPermission.id) || [];
        const selectedTypePerms = selectedRoleAndPermissions?.permissions.filter(p => p.typeOfPermission.id === typeOfPermission.id) || [];

        return (
          <div key={typeOfPermission.id} className={styles.permissionTypeSection}>
            <div className={styles.allPermissions}>
              <h4 className={styles.permissionTypeTitle}>{typeOfPermission.name}</h4>
              <div className={styles.selectAllPermissions}>
                <input
                  className={styles.permissionCheckbox}
                  type="checkbox"
                  id={`all-${typeOfPermission.id}`}
                  name={`all-${typeOfPermission.id}`}
                  checked={typePerms.length === selectedTypePerms.length}
                  onChange={(e) => handleChangeSelectAllByType(typeOfPermission.id, e.target.checked)}
                />
                <label htmlFor={`all-${typeOfPermission.id}`}><strong>Todos</strong></label>
              </div>
            </div>
            <div className={styles.permissionTypePermissions}>
              {permissions
                ?.filter((permission) => permission.typeOfPermission.id === typeOfPermission.id)
                .map((permission) => (
                  <div key={permission.id} className={styles.permissionItem}>
                    <input
                      className={styles.permissionCheckbox}
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      name={permission.name}
                      checked={permissionIsPresentInRole(selectedRoleAndPermissions?.permissions, permission)}
                      onChange={() => handlePermissionToggle(permission)}
                    />
                    <label htmlFor={`permission-${permission.id}`}>{permission.name}</label>
                  </div>
                ))}
            </div>
          </div>
        )
      })}
    </>
  );
}

function permissionIsPresentInRole(rolePermissions: Permission[] | undefined, permission: Permission): boolean {
  if (!rolePermissions) return false;

  return rolePermissions.some((rolePermission) => rolePermission.id === permission.id);
}
