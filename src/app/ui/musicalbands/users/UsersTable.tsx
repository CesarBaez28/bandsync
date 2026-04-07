'use client';

import styles from './users-table.module.css';
import stylesForm from "../../../styles/form.module.css"
import stylesModal from "../../../styles/modal.module.css";
import { MusicalRole, MusicalRolesUsers, PagedData, User } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import CustomImage from "../../image/CustomImage";
import Modal from '../../modal/Modal';
import { useActionState, useCallback, useEffect, useState } from 'react';
import { leaveMusicalBandAction, LeaveMusicalBandState } from '@/app/lib/actions/users';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast/ToastContext';
import CustomSelect, { OptionInputSelect } from '../../Inputs/CustomSelect';
import { assignMusicalRolesToUserAction, AssignMusicalRolesToUserActionState } from '@/app/lib/actions/muscalRoles';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import EditIcon from '@/public/edit_24dp.svg';
import DeleteIcon from '@/public/delete_24dp.svg';
import AddIcon from '@/public/add_2_24dp.svg';
import PersonIcon from '@/public/person_24dp.svg'

type Props = {
  readonly musicalBandId: UUID | undefined;
  readonly currentUserId: string | undefined;
  readonly users: PagedData<User> | undefined;
  readonly musicalRoles: MusicalRole[] | undefined;
  readonly musicalRolesUsers?: MusicalRolesUsers[];
  readonly hypName: string;
}

export default function UsersTable({
  users,
  musicalRolesUsers,
  musicalRoles,
  hypName,
  currentUserId,
  musicalBandId }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedMusicalRolesUsers, setSelectedMusicalRolesUsers] = useState<MusicalRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const initialState: AssignMusicalRolesToUserActionState = { message: null, success: false };
  const [state, formAction, isPending] = useActionState<AssignMusicalRolesToUserActionState, FormData>(assignMusicalRolesToUserAction, initialState);
  const initialDeleteState: LeaveMusicalBandState = { message: null, success: false };
  const [deleteState, formDeleteAction, isDeletingPending] = useActionState<LeaveMusicalBandState, FormData>(leaveMusicalBandAction, initialDeleteState);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  const options: OptionInputSelect[] | undefined = musicalRoles
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((musicalRole) => (
      { label: musicalRole.name, value: musicalRole.id.toString() }
    ));

  const handleCancel = useCallback(() => {
    setOpenDeleteModal(false);
    setOpenEditModal(false);
    setSelectedUser(null);
    setSelectedMusicalRolesUsers([]);
    deleteState.message = null;
    deleteState.success = false;
    state.message = null;
    state.success = false;
  }, [deleteState, state]);

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setOpenEditModal(true);
    setSelectedMusicalRolesUsers(
      musicalRolesUsers?.find(mru => mru.userId === user.id)?.musicalRoles || []
    );
  }

  const handleAddRole = () => {
    const roleToAdd = musicalRoles?.find(role => role.id.toString() === selectedRole);
    if (roleToAdd && !selectedMusicalRolesUsers.some(r => r.id === roleToAdd.id)) {
      setSelectedMusicalRolesUsers([...selectedMusicalRolesUsers, roleToAdd]);
      setSelectedRole('');
    }
  }

  const handleDeleteRole = (role: MusicalRole) => {
    if (selectedMusicalRolesUsers) {
      setSelectedMusicalRolesUsers(selectedMusicalRolesUsers.filter(r => r.id !== role.id));
    }
  }

  useEffect(() => {
    if (deleteState?.success) {
      handleCancel();
      showToast('Integrante eliminado correctamente.', 'success');
      router.push(`/musicalbands/${hypName}/users`);
    }
  }, [deleteState.success, handleCancel, hypName, router, showToast]);

  useEffect(() => {
    if (state?.success) {
      handleCancel();
      showToast('Roles musicales asignados con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/users`);
    }
  }, [state.success, handleCancel, showToast, router, hypName]);

  return (
    <div id="modal-root">
      {(users?.content?.length ?? 0) > 0 ? (
        <table>
          <thead>
            <tr>
              <Can anyOf={[UserPermissions.UPDATE_MEMBER, UserPermissions.DELETE_MEMBER]} musicalBandId={musicalBandId}>
                <th>Acciones</th>
              </Can>
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
                <Can anyOf={[UserPermissions.UPDATE_MEMBER, UserPermissions.DELETE_MEMBER]} musicalBandId={musicalBandId}>
                  <td>
                    <div style={{ display: 'flex', gap: '.6rem' }}>
                      <Can permission={UserPermissions.UPDATE_MEMBER} musicalBandId={musicalBandId}>
                        <CustomButton variant="tertiary" type='button' onClick={() => handleEdit(user)}>
                          <EditIcon width={24} height={24} />
                        </CustomButton>
                      </Can>
                      <Can permission={UserPermissions.DELETE_MEMBER} musicalBandId={musicalBandId}>
                        <CustomButton disabled={user.id === currentUserId} onClick={() => handleDelete(user)} variant="tertiary" type="button">
                          <DeleteIcon width={24} height={24} />
                        </CustomButton>
                      </Can>
                    </div>
                  </td>
                </Can>
                <td>
                  <span className={styles.usernameContainer}>
                    <CustomImage
                      src={user?.photo}
                      alt={'Foto de perfil'}
                      width={48}
                      height={48}
                      fallback={<PersonIcon width={24} height={24} />}
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
                    )) ?? ''
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
        isOpen={openEditModal}
        title="Asignar Roles musicales"
      >

        <form action={formAction} className={stylesForm.fieldsContainer}>

          <div className={styles.selectAddContainer}>
            <CustomSelect
              placeholder='Escoja un rol y agréguelo'
              fullWidth={true}
              name="musicalRoles"
              options={options || []}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
            <CustomButton onClick={handleAddRole} type='button'>
              <AddIcon width={16} height={16} />
            </CustomButton>
          </div>

          {selectedMusicalRolesUsers.length !== 0 && (
            <div className={styles.rolesContainer}>
              {selectedMusicalRolesUsers?.map((mr) => (
                <div className={styles.role} key={mr.id}>
                  <div className={styles.roleContent}>
                    <span>{mr.name}</span>
                    <CustomButton onClick={() => handleDeleteRole(mr)} type='button' variant='tertiary'>
                      <DeleteIcon width={20} height={20} />
                    </CustomButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          {state?.message && (
            <p className={stylesForm.errorMessage}>
              {state?.message}
            </p>
          )}

          <input type="hidden" name="userId" value={selectedUser?.id} />
          <input type="hidden" name="musicalBandId" value={musicalBandId} />
          <input type="hidden" name="roles" value={selectedMusicalRolesUsers.map(role => role.id).toString()} />

          <div className={stylesModal.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleCancel}>
              Cancelar
            </CustomButton>
            <CustomButton isLoading={isPending} type='submit'>
              Guardar
            </CustomButton>
          </div>
        </form>
      </Modal>

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