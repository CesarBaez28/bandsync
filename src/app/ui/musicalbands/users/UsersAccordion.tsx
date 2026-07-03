"use client";

import styles from './users-content.module.css';
import stylesResponsive from '@/app/styles/responsive.module.css';
import { MusicalRolesUsers, PagedData, User } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import CustomImage from "../../image/CustomImage";
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import EditIcon from '@/public/edit_24dp.svg';
import DeleteIcon from '@/public/delete_24dp.svg';
import PersonIcon from '@/public/person_24dp.svg'
import Accordion from '../../accordion/Accordion';
import { UUID } from 'node:crypto';

type Props = {
  readonly users: PagedData<User> | undefined;
  readonly musicalRolesUsers: MusicalRolesUsers[] | undefined;
  readonly currentUserId: string | undefined;
  readonly musicalBandId: UUID | undefined;
  readonly onEdit?: (user: User) => void;
  readonly onDelete?: (user: User) => void;
}

export default function UsersAccordion({ users, musicalRolesUsers, currentUserId, musicalBandId, onEdit, onDelete }: Props) {
  return (
    <div className={stylesResponsive.stackOnMobile}>
      {users?.content?.map((user) => (
        <Accordion
          key={user.id}
          header={(
            <div className={styles.usernameContainer}>
              <CustomImage
                src={user?.photo}
                alt={'Foto de perfil'}
                width={48}
                height={48}
                fallback={<PersonIcon width={24} height={24} />}
                className={user?.photo ? styles['image'] : styles['fall-back']}
              />
              <div className={styles.usernameText}>
                <div className={styles.username}>{user.username}</div>
                <div className={styles.fullname} title={`${user.firstName} ${user.lastName}`}>{`${user.firstName} ${user.lastName}`}</div>
              </div>
            </div>
          )}
          actions={(
            <>
              <Can permission={UserPermissions.UPDATE_MEMBER} musicalBandId={musicalBandId}>
                <CustomButton
                  variant="tertiary" type='button'
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(user); }}
                >
                  <EditIcon width={24} height={24} />
                </CustomButton>
              </Can>
              <Can permission={UserPermissions.DELETE_MEMBER} musicalBandId={musicalBandId}>
                <CustomButton
                  disabled={user.id === currentUserId}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(user); }}
                  variant="tertiary"
                  type="button"
                >
                  <DeleteIcon width={24} height={24} />
                </CustomButton>
              </Can>
            </>
          )}
        >
          <div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Correo:</strong>
              <span>{user.email}</span>
            </div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Roles:</strong>
              <div>
                {musicalRolesUsers?.find(mru => mru.userId === user.id)?.musicalRoles.map((mr) => (
                  <span key={mr.id} className={styles.roleBadge}>{mr.name}</span>
                )) ?? ''}
              </div>
            </div>
            <div className={stylesResponsive.rowAlignCenter}>
              <strong>Contacto:</strong>
              <span>{user.phone}</span>
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  );
}
