'use client';

import { MusicalBand, MusicalBandInfo } from "@/app/lib/definitions";
import styles from './settings-container.module.css';
import stylesForm from '../../../styles/form.module.css';
import CustomImage from "../../image/CustomImage";
import CustomButton from "../../button/CustomButton";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import Modal from "../../modal/Modal";
import { useToast } from "../../toast/ToastContext";
import CustomInput from "../../Inputs/CustomInput";
import CustomFileInput from "../../Inputs/CustomFileInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMusicalBandAction, UpdateMusicalBandState } from "@/app/lib/actions/musicalbands";
import { createMusicalBandSchema, CreateMusicalBandSchema } from "@/app/lib/schemas/createMusicalBandSchema";

type Props = {
  readonly musicalBand: MusicalBand | undefined
}

export default function SettingsContent({ musicalBand }: Props) {
  const [band, setBand] = useState<MusicalBandInfo | undefined>(musicalBand);
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const initialState: UpdateMusicalBandState = { errors: {}, message: null, success: false, band: musicalBand };
  const [state, formAction, isPending] = useActionState<UpdateMusicalBandState, FormData>(updateMusicalBandAction, initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateMusicalBandSchema>({
    resolver: zodResolver(createMusicalBandSchema),
    mode: "onChange",
    defaultValues: {
      name: band?.name,
      address: band?.address,
      phone: band?.phone,
      email: band?.email,
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
        name: state.band?.name,
        address: state.band?.address,
        phone: state.band?.phone,
        email: state.band?.email,
      });
    } 

    formRef.current?.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setOpen(false);
  }, [reset, formRef, fileInputRef, state]);

  useEffect(() => {
    if (state.success) {
      setBand(state.band)
      handleCancel();
      showToast('¡Banda actualizada exitosamente!', 'success');
    }
  }, [state, handleCancel, showToast])

  return (
    <main className={`${styles.mainContent} col-12 col-sm-8 col-md-6 col-lg-6`} id="modal-root">

      <h2>Configuración de la banda</h2>

      <div className={`${styles.card}`}>
        <header className={styles['header']}>
          <CustomImage
            src={band?.logo}
            alt={'Foto de perfil'}
            width={80}
            height={80}
            fallBackSrc='/person_24dp.svg'
            className={band?.logo ? styles['image'] : styles['fall-back']}
          />
          <div>
            <h3>{band?.name}</h3>
            <p className={styles['color-gray-300']}>{band?.email}</p>
          </div>
        </header>
      </div>

      <div className={`${styles.card}`}>
        <div className={styles['info-container']}>
          <h3>Información de la banda</h3>
          <div className={styles['info']}>
            <p>Nombre:</p>
            <p className={styles['color-gray-300']}>{band?.name !== '' ? band?.name : 'No disponible'}</p>
            <p>Dirección:</p>
            <p className={styles['color-gray-300']}>{band?.address !== '' ? band?.address : 'No disponible'}</p>
            <p>Teléfono:</p>
            <p className={styles['color-gray-300']}>{band?.phone !== '' ? band?.phone : 'No disponible'}</p>
          </div>
          <div>
            <CustomButton type='button' onClick={() => setOpen(true)}>
              Editar información
            </CustomButton>
          </div>
        </div>
      </div>

      <Modal
        isOpen={open}
        size='sm'
        title='Editar información de la banda'
      >
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={stylesForm.fieldsContainer}>
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
              <p className={stylesForm.errorMessage}>
                {state?.message}
              </p>
            )}

            <input type="hidden" name="musicalBandId" value={musicalBand?.id} />
            <input type="hidden" name="logo" value={musicalBand?.logo} />

            <div className={stylesForm.buttonsContainer}>
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

    </main>
  )
}