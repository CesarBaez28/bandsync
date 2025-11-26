'use client';

import styles from './users-table.module.css';
import { MusicalRolesUsers, PagedData, User } from "@/app/lib/definitions";
import CustomLink from "../../link/CustomLink";
import Image from "next/image";
import CustomButton from "../../button/CustomButton";
import CustomImage from "../../image/CustomImage";

type Props = {
  readonly currentUserId: string | undefined;
  readonly users: PagedData<User> | undefined;
  readonly musicalRolesUsers?: MusicalRolesUsers[];
  readonly hypName: string;
}

export default function UsersTable({ users, musicalRolesUsers, hypName, currentUserId }: Props) {
  const handleDelete = (user: User) => {
    console.log(user);
  }

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
                    <CustomLink href={`/musicalbands/${hypName}/users/${user.id}/edit`} variant="tertiary">
                      <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                    </CustomLink>
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
    </div>
  );
}