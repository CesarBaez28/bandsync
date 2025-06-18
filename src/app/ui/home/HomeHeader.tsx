'use client';

import { signOutAction } from '@/app/lib/actions/auth';
import CustomButton from '../button/CustomButton';
import DropdownMenu from '../dropdown/DropdownMenu';
import styles from './home-header.module.css'
import Image from 'next/image';
import { startTransition, useActionState, useRef, useState } from 'react';
import Modal from '../modal/Modal';
import { createMusicalBandAction, CreateMusicalBandState } from '@/app/lib/actions/musicalbands';
import { createMusicalBandSchema, CreateMusicalBandSchema } from '@/app/lib/schemas/createMusicalBandSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomInput from '../Inputs/CustomInput';
import CustomFileInput from '../Inputs/CustomFileInput';
import Header from '../header/Header';

export default function HomeHeader() {
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

  const handleCancel = () => {
    reset();
    formRef.current?.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setOpen(false);
  };

  return <>
    <Header>
      <h2>BandSync</h2>
      <div className={styles['header-buttons']}>
        <CustomButton
          iconLeft={<Image
            src="/add_24dp.svg"
            alt="Icono de añadir banda"
            width={24}
            height={24}
          />
          }
          variant='secondary'
          style={{ padding: '0.4rem 0.4rem' }}
          onClick={() => setOpen(true)}
        >
          Crear una banda
        </CustomButton>

        <DropdownMenu
          trigger={
            <CustomButton variant="secondary" style={{ padding: '0.4rem' }}>
              <Image src="/person_24dp.svg" alt="perfil" width={24} height={24} />
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