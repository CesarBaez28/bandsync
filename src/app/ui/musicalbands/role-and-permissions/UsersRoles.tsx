'use client';

import stylesForm from '../../../styles/form.module.css'
import stylesModal from '../../../styles/modal.module.css';
import { Role, User, UserRole, UserRolesAndPermissions } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import { UUID } from "node:crypto";
import Modal from "../../modal/Modal";
import CustomSelect, { OptionInputSelect } from '../../Inputs/CustomSelect';
import { assignRoleToUserAction, deleteUserRoleAction, DeleteUserRoleState, RoleStateAssign, updateUserRoleAction, UserRoleState } from '@/app/lib/actions/roles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRoleSchema, UserRoleSchema } from '@/app/lib/schemas/userRoleSchema';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast/ToastContext';
import { assingRoleToUserSchema, AssingRoleToUserSchema } from '@/app/lib/schemas/assingRoleToUserSchema';
import { usePermissions } from '@/app/lib/customHooks/usePermissions';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';

type Props = {
  readonly hypName: string;
  readonly currentUserId: UUID | undefined
  readonly usersRoles: UserRole[] | undefined
  readonly users: User[] | undefined;
  readonly roles: Role[] | undefined;
  readonly musicalBandId: UUID | undefined;
}

export default function UsersRolesContent({ currentUserId, users, usersRoles, roles, musicalBandId, hypName }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const { userRolesAndPermissions } = usePermissions();
  const [currentUserRole, setCurrentUserRole] = useState<UserRolesAndPermissions | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openAssignModal, setOpenAssignModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);
  const initialAssingnRoleState: RoleStateAssign = { success: false, errors: {}, message: null };
  const [assingState, formAssignAction, isAssignLoading] = useActionState<RoleStateAssign, FormData>(assignRoleToUserAction, initialAssingnRoleState);
  const formAssingRef = useRef<HTMLFormElement>(null);
  const initialState: UserRoleState = { success: false, errors: {}, message: null };
  const [state, formAction, isLoading] = useActionState<UserRoleState, FormData>(updateUserRoleAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const initialDeleteState: DeleteUserRoleState = { success: false, message: null };
  const [deleteState, formDeleteAction, isDeletingLoading] = useActionState<DeleteUserRoleState, FormData>(deleteUserRoleAction, initialDeleteState);

  const {
    register: assingRegister,
    handleSubmit: assingHandleSubmit,
    reset: assingReset,
    formState: { errors: assingErrors }
  } = useForm<AssingRoleToUserSchema>({
    resolver: zodResolver(assingRoleToUserSchema),
    mode: "onChange",
  });

  const onAssingSubmit = () => {
    if (!formAssingRef.current) return;

    const fd = new FormData(formAssingRef.current);

    startTransition(() => {
      formAssignAction(fd);
    });
  }

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserRoleSchema>({
    resolver: zodResolver(userRoleSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    startTransition(() => {
      formAction(fd);
    });
  }

  const handleCancel = useCallback(() => {
    reset();
    assingReset();
    state.message = null;
    state.errors = {}
    assingState.message = null;
    assingState.errors = {}
    deleteState.message = null;
    deleteState.success = false;
    setOpenModal(false);
    setOpenAssignModal(false);
    setSelectedUserRole(null);
    setOpenDeleteModal(false);
  }, [reset, state, assingReset, assingState, deleteState]);

  useEffect(() => {
    if (assingState.success) {
      handleCancel();
      showToast('Role asignado correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/roles-and-permissions`);
    }
  }, [assingState.success, handleCancel, router, showToast, hypName])

  useEffect(() => {
    if (state.success) {
      handleCancel();
      showToast('Role asignado correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/roles-and-permissions`);
    }
  }, [state.success, handleCancel, router, showToast, hypName])

  useEffect(() => {
    if (deleteState.success) {
      handleCancel();
      showToast('Role de usuario eliminado correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/roles-and-permissions`);
    }
  }, [deleteState.success, handleCancel, router, showToast, hypName])

  const rolesOptions: OptionInputSelect[] | undefined = roles
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((role) => (
      { label: role.name, value: role.id.toString() }
    ));

  const usersOptions: OptionInputSelect[] | undefined = users
    ?.sort((a, b) => a.firstName.localeCompare(b.firstName))
    .map((user) => (
      { label: user.username, value: user.id.toString() }
    ));

  const handleEdit = (userRole: UserRole) => {
    setSelectedUserRole(userRole);
    setValue("role", userRole.role.id.toString())
    setOpenModal(true);
  }

  const handleDelete = (userRole: UserRole) => {
    setOpenDeleteModal(true);
    setSelectedUserRole(userRole);
  }

  useEffect(() => {
    const currentRole = userRolesAndPermissions.find((ur) => ur.musicalBand.id === musicalBandId);
    if (currentRole) {
      setCurrentUserRole(currentRole);
    }
  }, [userRolesAndPermissions, musicalBandId])

  return (
    <div id="modal-root">
      <section>

        <Can permission={UserPermissions.ASSIGN_ROLE} musicalBandId={musicalBandId}>
          <CustomButton onClick={() => setOpenAssignModal(true)} type='button' style={{ marginBottom: '1rem' }}>
            Agregar usuario
          </CustomButton>
        </Can>

        <table>
          <thead>
            <tr>
              <Can anyOf={[UserPermissions.ASSIGN_ROLE]} musicalBandId={musicalBandId}>
                <th>Acciones</th>
              </Can>
              <th>Usuario</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {usersRoles?.map((userRole) => (
              <tr key={userRole.user.id}>
                <Can anyOf={[UserPermissions.ASSIGN_ROLE]} musicalBandId={musicalBandId}>
                  <td>
                    <div style={{ display: 'flex', gap: '.6rem' }}>
                      <CustomButton
                        onClick={() => handleEdit(userRole)}
                        disabled={currentUserRole?.role.id === userRole.role.id && userRole.user.id === currentUserId}
                        variant="tertiary"
                      >
                        <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                      </CustomButton>
                      <CustomButton
                        disabled={currentUserRole?.role.id === userRole.role.id && userRole.user.id === currentUserId}
                        variant='tertiary'
                        onClick={() => handleDelete(userRole)}
                      >
                        <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                      </CustomButton>
                    </div>
                  </td>
                </Can>
                <td>{userRole.user.username}</td>
                <td>{userRole.role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        size="sm"
        isOpen={openModal}
        title="Cambiar role"
      >
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit(onSubmit)}
        >

          <div className={stylesForm.fieldsContainer}>

            <CustomSelect
              label='Seleccione el role:'
              options={rolesOptions}
              {...register("role")}
              error={errors.role}
            />

            <input type="hidden" name="userId" value={selectedUserRole?.user.id} />
            <input type="hidden" name="musicalBandId" value={musicalBandId} />

            {state?.message && (
              <p className={stylesForm.errorMessage}>
                {state?.message}
              </p>
            )}

            <div className={stylesForm.buttonsContainer}>
              <CustomButton type='button' variant='secondary' onClick={handleCancel}>
                Cancelar
              </CustomButton>
              <CustomButton isLoading={isLoading} type='submit'>
                Guardar
              </CustomButton>
            </div>

          </div>
        </form>
      </Modal>

      <Modal
        size="sm"
        isOpen={openAssignModal}
        title="Agregar role a usuario"
      >
        <form
          ref={formAssingRef}
          action={formAssignAction}
          onSubmit={assingHandleSubmit(onAssingSubmit)}
        >

          <div className={stylesForm.fieldsContainer}>

            <CustomSelect
              label='Seleccione el usuario:'
              options={usersOptions}
              {...assingRegister("user")}
              error={assingErrors.user}
            />

            <CustomSelect
              label='Seleccione el role:'
              options={rolesOptions}
              {...assingRegister("role")}
              error={assingErrors.role}
            />

            <input type="hidden" name="musicalBandId" value={musicalBandId} />

            {assingState?.message && (
              <p className={stylesForm.errorMessage}>
                {assingState?.message}
              </p>
            )}

            <div className={stylesForm.buttonsContainer}>
              <CustomButton type='button' variant='secondary' onClick={handleCancel}>
                Cancelar
              </CustomButton>
              <CustomButton isLoading={isAssignLoading} type='submit'>
                Guardar
              </CustomButton>
            </div>

          </div>
        </form>
      </Modal>

      <Modal
        size="sm"
        isOpen={openDeleteModal}
        title="Eliminar role de usuario"
      >
        <form action={formDeleteAction} className={stylesModal.modalContent}>

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          <p>Al hacerlo, el usuario perderá los permisos que tenía. </p>

          {deleteState?.message && (
            <p className={stylesForm.errorMessage}>
              {deleteState?.message}
            </p>
          )}

          <input type="hidden" name="userId" value={selectedUserRole?.user?.id} />
          <input type="hidden" name="musicalBandId" value={musicalBandId} />

          <div className={stylesModal.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleCancel}>
              Cancelar
            </CustomButton>
            <CustomButton isLoading={isDeletingLoading} type='submit'>
              Eliminar
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}