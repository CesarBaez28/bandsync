'use client';

import styles from './users-table.module.css';
import stylesForm from "../../../styles/form.module.css"
import stylesModal from "../../../styles/modal.module.css";
import { MusicalRolesUsers, PagedData, User } from "@/app/lib/definitions";
import Image from "next/image";
import CustomButton from "../../button/CustomButton";
import CustomImage from "../../image/CustomImage";
import Modal from '../../modal/Modal';
import { useActionState, useCallback, useEffect, useState } from 'react';
import { leaveMusicalBandAction, LeaveMusicalBandState } from '@/app/lib/actions/users';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast/ToastContext';

type Props = {
  readonly musicalBandId: UUID | undefined;
  readonly currentUserId: string | undefined;
  readonly users: PagedData<User> | undefined;
  readonly musicalRolesUsers?: MusicalRolesUsers[];
  readonly hypName: string;
}

export default function UsersTable({ users, musicalRolesUsers, hypName, currentUserId, musicalBandId }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const initialDeleteState: LeaveMusicalBandState = { message: null, success: false };
  const [deleteState, formDeleteAction, isDeletingPending] = useActionState<LeaveMusicalBandState, FormData>(leaveMusicalBandAction, initialDeleteState);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const handleCancel = useCallback(() => {
    setOpenDeleteModal(false);
    setSelectedUser(null);
    deleteState.message = null;
    deleteState.success = false;
  }, [deleteState]);

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  }

  useEffect(() => {
    if (deleteState?.success) {
      handleCancel();
      showToast('Integrante eliminado correctamente.', 'success');
      router.push(`/musicalbands/${hypName}/users`);
    }
  }, [deleteState.success, handleCancel, hypName, router, showToast]);

  return (
    <div id="modal-root">
      {(users?.content?.length ?? 0) > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Roles</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            {users?.content.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <CustomButton variant="tertiary">
                      <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                    </CustomButton>
                    <CustomButton disabled={user.id === currentUserId} onClick={() => handleDelete(user)} variant="tertiary" type="button">
                      <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                    </CustomButton>
                  </div>
                </td>
                <td>
                  <span className={styles.usernameContainer}>
                    <CustomImage
                      src={user?.photo}
                      alt={'Foto de perfil'}
                      width={48}
                      height={48}
                      fallBackSrc='/person_24dp.svg'
                      className={user?.photo ? styles['image'] : styles['fall-back']}
                    />
                    {user.username}
                  </span>
                </td>
                <td>
                  {`${user.firstName} ${user.lastName}`}
                </td>
                <td>{user.email}</td>
                <td>
                  {
                    musicalRolesUsers?.find(mru => mru.userId === user.id)?.musicalRoles.map((mr) => (
                      <span key={mr.id} className={styles.roleBadge}>{mr.name}</span>
                    )) ?? 'Sin roles'
                  }
                </td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>) : (
        <div className="message">
          <h2>¡No se encontraron resultados!</h2>
          <p>Invite a un integrante o cambie los valores de su búsqueda</p>
        </div>)
      }

      <Modal
        size="sm"
        isOpen={openDeleteModal}
        title="Sacar integrante"
      >

        <form action={formDeleteAction} className={stylesModal.modalContent}>

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          <p>Toda la información de este usuario en la banda será eliminada </p>

          {deleteState?.message && (
            <p className={stylesForm.errorMessage}>
              {deleteState?.message}
            </p>
          )}

          <input type="hidden" name="userId" value={selectedUser?.id} />
          <input type="hidden" name="musicalBandId" value={musicalBandId} />

          <div className={stylesModal.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleCancel}>
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