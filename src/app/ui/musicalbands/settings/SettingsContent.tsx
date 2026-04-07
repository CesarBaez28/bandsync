'use client';

import { MusicalBand, MusicalBandInfo } from "@/app/lib/definitions";
import styles from './settings-container.module.css';
import stylesForm from '../../../styles/form.module.css';
import stylesModal from '../../../styles/modal.module.css'
import CustomImage from "../../image/CustomImage";
import CustomButton from "../../button/CustomButton";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import Modal from "../../modal/Modal";
import { useToast } from "../../toast/ToastContext";
import CustomInput from "../../inputs/CustomInput";
import CustomFileInput from "../../inputs/CustomFileInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteMusicalBandAction, DeleteMusicalBandActionState, updateMusicalBandAction, UpdateMusicalBandState } from "@/app/lib/actions/musicalbands";
import { createMusicalBandSchema, CreateMusicalBandSchema } from "@/app/lib/schemas/createMusicalBandSchema";
import { useRouter } from "next/navigation";
import { Can } from "../../authorization/Can";
import { UserPermissions } from "@/app/lib/permisions";
import PersonIcon from '@/public/person_24dp.svg'
import EditIcon from '@/public/edit_24dp.svg'
import DeleteIcon from '@/public/delete_24dp.svg'

type Props = {
  readonly musicalBand: MusicalBand | undefined
}

export default function SettingsContent({ musicalBand }: Props) {
  const [band, setBand] = useState<MusicalBandInfo | undefined>(musicalBand);
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const initialStateDelete: DeleteMusicalBandActionState = { success: false, message: null };
  const [deleteState, formActionDelete, isDeletingPending] = useActionState<DeleteMusicalBandActionState, FormData>(deleteMusicalBandAction, initialStateDelete);
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

  useEffect(() => {
    if (deleteState.success) {
      showToast('¡Banda eliminada exitosamente!', 'success')
      router.push(`/`);
    }
  }, [router, showToast, deleteState])

  return (
    <main className={`${styles.mainContent} col-12 col-sm-8 col-md-6 col-lg-6`} id="modal-root">

      <h2>Configuración de la banda</h2>

      <div className={`${styles.card}`}>
        <header className={styles['header']}>
          <CustomImage
            src={band?.logo}
            alt={'logo de la banda'}
            width={80}
            height={80}
            fallback={<PersonIcon width={80} height={80} />}
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

          <Can anyOf={[UserPermissions.UPDATE_BAND, UserPermissions.DELETE_BAND]} musicalBandId={musicalBand?.id}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>

              <Can permission={UserPermissions.UPDATE_BAND} musicalBandId={musicalBand?.id}>
                <CustomButton
                  iconLeft={<EditIcon width={20} height={20} />}
                  type='button'
                  onClick={() => setOpen(true)}
                >
                  Editar
                </CustomButton>
              </Can>

              <Can permission={UserPermissions.DELETE_BAND} musicalBandId={musicalBand?.id}>
                <form action={formActionDelete}>

                  <input type="hidden" name="musicalBandId" value={musicalBand?.id} />

                  <CustomButton
                    onClick={() => setOpenDelete(true)}
                    iconLeft={<DeleteIcon width={20} height={20} />}
                    type="button"
                  >
                    Eliminar
                  </CustomButton>
                </form>
              </Can>

            </div>
          </Can>
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

      <Modal
        size="sm"
        isOpen={openDelete}
        title="Eliminar banda musical"
      >
        <form action={formActionDelete} className={stylesModal.modalContent}>

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          <p>Toda la información relacionada con esta banda será eliminada. Esta acción no se puede revertir. </p>

          {deleteState?.message && (
            <p className={stylesForm.errorMessage}>
              {deleteState?.message}
            </p>
          )}

          <input type="hidden" name="musicalBandId" value={musicalBand?.id} />

          <div className={stylesModal.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={() => setOpenDelete(false)}>
              Cancelar
            </CustomButton>
            <CustomButton isLoading={isDeletingPending} type='submit'>
              Eliminar
            </CustomButton>
          </div>
        </form>
      </Modal>

    </main>
  )
}