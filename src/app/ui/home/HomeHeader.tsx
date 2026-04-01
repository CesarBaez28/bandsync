'use client';

import { signOutAction } from '@/app/lib/actions/auth';
import CustomButton from '../button/CustomButton';
import DropdownMenu from '../dropdown/DropdownMenu';
import styles from './home-header.module.css'
import { Dispatch, SetStateAction, startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import Modal from '../modal/Modal';
import { createMusicalBandAction, CreateMusicalBandState } from '@/app/lib/actions/musicalbands';
import { createMusicalBandSchema, CreateMusicalBandSchema } from '@/app/lib/schemas/createMusicalBandSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomInput from '../Inputs/CustomInput';
import CustomFileInput from '../Inputs/CustomFileInput';
import Header from '../header/Header';
import { MusicalBand } from '@/app/lib/definitions';
import { useToast } from '../toast/ToastContext';
import AddIcon from '@/public/add_24dp.svg'
import PersonIcon from '@/public/person_24dp.svg'
import ThemeToggle from '../button/ThemeToggle';

type HomeHeaderProps = {
  readonly setData: Dispatch<SetStateAction<MusicalBand[] | null>>;
  readonly appName: string;
};

export default function HomeHeader({ setData, appName }: HomeHeaderProps) {
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const initialState: CreateMusicalBandState = { errors: {}, data: null, message: null, success: false };
  const [state, formAction, isPending] = useActionState<CreateMusicalBandState, FormData>(createMusicalBandAction, initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateMusicalBandSchema>({
    resolver: zodResolver(createMusicalBandSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    startTransition(() => {
      formAction(fd);
    });
  };

  const handleCancel = useCallback(() => {
    reset();
    formRef.current?.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setOpen(false);
  }, [reset, formRef, fileInputRef]);

  useEffect(() => {
    if (state?.success && state?.data) {
      handleCancel();
      setData(prevData => state.data ? [...(prevData ?? []), state.data] : prevData);
      showToast('¡Banda creada exitosamente!', 'success');
    }
  }, [state, handleCancel, showToast, setData])

  return <>
    <Header>
      <h2>{appName}</h2>
      <div className={styles['header-buttons']}>
        <CustomButton
          iconLeft={<AddIcon width={24} height={24} />}
          variant='secondary'
          style={{ padding: '0.4rem 0.4rem' }}
          onClick={() => setOpen(true)}
        >
          Crear una banda
        </CustomButton>

        <ThemeToggle />

        <DropdownMenu
          trigger={
            <CustomButton variant="secondary" style={{ padding: '0.4rem' }}>
              <PersonIcon width={24} height={24} />
            </CustomButton>
          }
          options={[
            { label: 'Ver perfil', href: '/profile' },
            { label: 'Cerrar sesión', action: signOutAction, isFormAction: true },
          ]}
        />
      </div>
    </Header>
    <div id='modal-root'>
      <Modal
        isOpen={open}
        size='sm'
        title='Crear Banda'
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
              {...register("name")}
              error={errors.name}
            />

            <CustomInput
              type='email'
              label='Email:'
              {...register("email")}
              error={errors.email}
            />

            <CustomInput
              type='text'
              label='Dirección:'
              {...register("address")}
              error={errors.address}
            />

            <CustomInput
              label='Teléfono:'
              {...register("phone")}
              error={errors.phone}
            />

            <CustomFileInput
              ref={fileInputRef}
              name="image"
              label="Logo de la banda:"
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