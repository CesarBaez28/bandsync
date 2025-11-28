'use client';

import { User } from '@/app/lib/definitions';
import CustomButton from '../button/CustomButton';
import CustomImage from '../image/CustomImage';
import CustomLink from '../link/CustomLink';
import styles from './profile-content.module.css';
import Modal from '../modal/Modal';
import { startTransition, useActionState, useEffect, useRef, useState, useCallback } from 'react';
import { editUserSchema, EditUseSchema } from '@/app/lib/schemas/editUserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomInput from '../Inputs/CustomInput';
import CustomFileInput from '../Inputs/CustomFileInput';
import { updateUserAction, UpdateUserState } from '@/app/lib/actions/users';
import { useToast } from '../toast/ToastContext';

export default function ProfileContent({ user }: Readonly<{ user: User | undefined }>) {
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialState: UpdateUserState = { errors: {}, message: null, success: false, user };
  const [state, formAction, isPending] = useActionState<UpdateUserState, FormData>(updateUserAction, initialState);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (state?.success) {
      handleCancel();
      showToast('¡Usuario actualizado con éxito!', 'success');
    }
  }, [state, showToast, handleCancel]);

  return <>
    <div className={`${styles.profile} col-12 col-sm-8 col-md-6 col-lg-6`}>

      <div className={`${styles.card}`}>
        <header className={styles['header-profile']}>
          <CustomImage
            src={state.user?.photo}
            alt={'Foto de perfil'}
            width={80}
            height={80}
            fallBackSrc='/person_24dp.svg'
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
          <div>
            <CustomButton type='button' onClick={() => setOpen(true)}>
              Editar información
            </CustomButton>
          </div>
        </div>
      </div>

      <div className={`${styles.card}`}>
        <div className={styles['security-container']}>
          <h3>Seguridad</h3>
          <div>
            <CustomLink variant="secondary" href={'/change-password'}>
              Cambiar contraseña
            </CustomLink>
          </div>
          <div>
            <CustomLink variant="secondary" href={'/two-factor'}>
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
    </div>
  </>;
}