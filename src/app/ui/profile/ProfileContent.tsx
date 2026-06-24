'use client';

import { User } from '@/app/lib/definitions';
import CustomButton from '../button/CustomButton';
import CustomImage from '../image/CustomImage';
import CustomLink from '../link/CustomLink';
import styles from './profile-content.module.css';
import stylesModal from '@/app/styles/modal.module.css';
import stylesForm from '@/app/styles/form.module.css';
import Modal from '../modal/Modal';
import { startTransition, useActionState, useEffect, useRef, useState, useCallback } from 'react';
import { editUserSchema, EditUseSchema } from '@/app/lib/schemas/editUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomInput from '../inputs/CustomInput';
import CustomFileInput from '../inputs/CustomFileInput';
import { deleteAccountAction, DeleteAccountState, updateUserAction, UpdateUserState } from '@/app/lib/actions/users';
import { useToast } from '../toast/ToastContext';
import PersonSvg from '@/public/person_24dp.svg'
import EditIcon from '@/public/edit_24dp.svg'
import DeleteIcon from '@/public/delete_24dp.svg'
import { useRouter } from 'next/navigation';
import { signOutAction } from '@/app/lib/actions/auth';

type Props = {
  readonly user: User | undefined;
  readonly hypName?: string;
}

export default function ProfileContent({ user, hypName }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialState: UpdateUserState = { errors: {}, message: null, success: false, user };
  const initialDeleteState: DeleteAccountState = { message: null, success: false, hasToAssignAdminRole: false };
  const [state, formAction, isPending] = useActionState<UpdateUserState, FormData>(updateUserAction, initialState);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteState, formActionDelete, isDeletingPending] = useActionState<DeleteAccountState, FormData>(deleteAccountAction, initialDeleteState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditUseSchema>({
    resolver: zodResolver(editUserSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? ''
    }
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    startTransition(() => {
      formAction(fd);
    });
  };

  const handleCancel = useCallback(() => {
    if (state.success) {
      reset({
        firstName: state.user?.firstName ?? '',
        lastName: state.user?.lastName ?? '',
        email: state.user?.email ?? '',
        phone: state.user?.phone ?? ''
      });
    }

    formRef.current?.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setOpen(false);
  }, [reset, formRef, fileInputRef, state]);

  const handleCancelDelete = useCallback(() => {
    deleteState.message = null;
    deleteState.success = false;
    deleteState.hasToAssignAdminRole = false;
    setOpenDelete(false);
  }, [deleteState]);

  useEffect(() => {
    if (state?.success) {
      handleCancel();
      showToast('¡Usuario actualizado con éxito!', 'success');
    }
  }, [state, showToast, handleCancel]);

  useEffect(() => {
    if (deleteState?.success) {
      handleCancelDelete();
      signOutAction();
      showToast('¡Cuenta eliminada con éxito!', 'success');
    }

    if (deleteState?.hasToAssignAdminRole) {
      handleCancelDelete();
      router.push(hypName ? `/musicalbands/${hypName}/delete-account` : '/delete-account');
    }
  }, [deleteState, showToast, router, handleCancelDelete, hypName]);

  return <>
    <div className={`${styles.profile} col-12 col-sm-8 col-md-6 col-lg-6`}>

      <div className={`${styles.card}`}>
        <header className={styles['header-profile']}>
          <CustomImage
            src={state.user?.photo}
            alt={'Foto de perfil'}
            width={80}
            height={80}
            fallback={<PersonSvg width={60} height={60} />}
            className={state.user?.photo ? styles['profile-photo'] : styles['profile-fall-back']}
          />
          <div>
            <h3>{user?.username}</h3>
            <p className={styles['color-gray-300']}>{state.user?.email}</p>
          </div>
        </header>
      </div>

      <div className={`${styles.card}`}>
        <div className={styles['user-info-container']}>
          <h3>Datos de su usuario</h3>
          <div className={styles['user-info']}>
            <p>Nombre:</p>
            <p className={styles['color-gray-300']}>{state.user?.firstName !== '' ? state.user?.firstName : 'No disponible'}</p>
            <p>Apellido:</p>
            <p className={styles['color-gray-300']}>{state.user?.lastName !== '' ? state.user?.lastName : 'No disponible'}</p>
            <p>Teléfono:</p>
            <p className={styles['color-gray-300']}>{state.user?.phone !== '' ? state.user?.phone : 'No disponible'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
            <CustomButton
              type='button'
              iconLeft={<EditIcon width={20} height={20} />}
              onClick={() => setOpen(true)}>
              Editar
            </CustomButton>
            <CustomButton
              type='button'
              iconLeft={<DeleteIcon width={20} height={20} />}
              onClick={() => setOpenDelete(true)}>
              Eliminar cuenta
            </CustomButton>
          </div>
        </div>
      </div>

      <div className={`${styles.card}`}>
        <div className={styles['security-container']}>
          <h3>Seguridad</h3>
          <div>
            <CustomLink variant="secondary" href={hypName ? `/musicalbands/${hypName}/change-password` : '/change-password'}>
              Cambiar contraseña
            </CustomLink>
          </div>
          <div>
            <CustomLink variant="secondary" href={hypName ? `/musicalbands/${hypName}/two-factor` : '/two-factor'}>
              Autenticación en dos pasos
            </CustomLink>
          </div>
        </div>
      </div>
    </div>
    <div id='modal-root'>
      <Modal
        isOpen={open}
        size='sm'
        title='Editar información'
      >
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles['fields-container']}>
            <CustomInput
              label='Nombre:'
              type='text'
              {...register("firstName")}
              error={errors.firstName}
            />

            <CustomInput
              type='text'
              label='Apellido:'
              {...register("lastName")}
              error={errors.lastName}
            />

            <CustomInput
              type='text'
              label='Email:'
              {...register("email")}
              error={errors.email}
            />

            <CustomInput
              type='text'
              label='Teléfono:'
              {...register("phone")}
              error={errors.phone}
            />

            <CustomFileInput
              ref={fileInputRef}
              name="image"
              label="Foto de usuario:"
              accept="image/*"
              helperText="JPG, PNG o SVG (max. 5MB)"
              buttonText="Seleccionar imagen"
            />

            {state?.message && (
              <p className={styles['error-message']}>
                {state?.message}
              </p>
            )}
            <input type="hidden" name="redirectTo" value={"/"} />
            <div className={styles['buttons-container']}>
              <CustomButton type='button' variant='secondary' onClick={handleCancel}>
                Cancelar
              </CustomButton>
              <CustomButton isLoading={isPending} type='submit'>
                Guardar
              </CustomButton>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={openDelete}
        size='sm'
        title='Eliminar cuenta'
      >
        <form
          action={formActionDelete}
          className={stylesModal.modalContent}
        >

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          <p>Tu cuenta será eliminada permanentemente. Esta acción no se puede revertir. </p>

          {deleteState?.message && (
            <p className={stylesForm.errorMessage}>
              {deleteState?.message}
            </p>
          )}

          <input type="hidden" name="userId" value={user?.id} />

          <div className={stylesModal.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={() => setOpenDelete(false)}>
              Cancelar
            </CustomButton>
            <CustomButton
              isLoading={isDeletingPending}
              type='submit'
            >
              Eliminar
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  </>;
}