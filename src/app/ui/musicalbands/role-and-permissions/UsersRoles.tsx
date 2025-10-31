'use client';

import stylesForm from '../../../styles/form.module.css'
import { Role, UserRole, UserRolesAndPermissions } from "@/app/lib/definitions";
import { usePermissionsStore } from "@/app/store/usePermissionsStore";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import { UUID } from "node:crypto";
import Modal from "../../modal/Modal";
import CustomSelect, { OptionInputSelect } from '../../Inputs/CustomSelect';
import { updateUserRoleAction, UserRoleState } from '@/app/lib/actions/roles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRoleSchema, UserRoleSchema } from '@/app/lib/schemas/userRoleSchema';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast/ToastContext';

type Props = {
  readonly hypName: string;
  readonly currentUserId: UUID | undefined
  readonly usersRoles: UserRole[] | undefined
  readonly roles: Role[] | undefined;
  readonly musicalBandId: UUID | undefined;
}

export default function UsersRolesContent({ currentUserId, usersRoles, roles, musicalBandId, hypName }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const { userRolesAndPermissions } = usePermissionsStore();
  const [currentUserRole, setCurrentUserRole] = useState<UserRolesAndPermissions | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);
  const initialState: UserRoleState = { success: false, errors: {}, message: null }
  const [state, formAction, isLoading] = useActionState<UserRoleState, FormData>(updateUserRoleAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

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
    state.message = null;
    state.errors = {}
    setOpenModal(false);
    setSelectedUserRole(null);
  }, [reset, state])

  useEffect(() => {
    if (state.success) {
      handleCancel();
      showToast('Role asignado correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/roles-and-permissions`);
    }
  }, [state.success, handleCancel, router, showToast, hypName])

  const rolesOptions: OptionInputSelect[] | undefined = roles
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((role) => (
      { label: role.name, value: role.id.toString() }
    ));

  const handleEdit = (userRole: UserRole) => {
    setSelectedUserRole(userRole);
    setValue("role", userRole.role.id.toString())
    setOpenModal(true);
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
        <table>
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Nombre</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {usersRoles?.map((userRole) => (
              <tr key={userRole.user.id}>
                <td>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <CustomButton
                      onClick={() => handleEdit(userRole)}
                      disabled={currentUserRole?.role.id === userRole.role.id && userRole.user.id === currentUserId}
                      variant="tertiary"
                    >
                      <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                    </CustomButton>
                  </div>
                </td>
                <td>{userRole.user.firstName}</td>
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
    </div>
  )
}