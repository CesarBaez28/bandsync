'use client';

import styles from './input-container.module.css';
import stylesForm from '../../../styles/form.module.css';
import { UUID } from "crypto"
import Search from "../../search/Search";
import CustomButton from "../../button/CustomButton";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../../toast/ToastContext';
import { createMusicalGenreAction, MusicalGenreActionState } from '@/app/lib/actions/musicalGenres';
import { musicalGenreSchema, MusicalGenreSchema } from '@/app/lib/schemas/musicalGenteSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Modal from '../../modal/Modal';
import CustomInput from '../../Inputs/CustomInput';
import { useRouter } from 'next/navigation';

type InputContainerProps = {
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string
}

export default function InputContainer({ musicalBandId, hypName }: InputContainerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: MusicalGenreActionState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<MusicalGenreActionState, FormData>(createMusicalGenreAction, initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MusicalGenreSchema>({
    resolver: zodResolver(musicalGenreSchema),
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
    state.errors = {};
    state.message = null;
    setOpen(false);
  }, [reset, formRef, state]);

  useEffect(() => {
    if (state?.success) {
      handleCancel();
      showToast('Género musical registrado con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/genres`);
    }
  }, [state, showToast, handleCancel, hypName, router]);

  return (
    <div id="modal-root" className={styles.inputContainer}>
      <Search placeholder="Escriba el nombre del género" />

      <CustomButton variant="primary" type="button" onClick={() => setOpen(true)}>
        Agregar
      </CustomButton>

      <Modal
        size="sm"
        isOpen={open}
        title="Crear género musical"
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

            <input type="hidden" name="musicalBandId" value={musicalBandId} />

            {state?.message && (
              <p className={stylesForm.errorMessage}>
                {state?.message}
              </p>
            )}

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
    </div>
  )
} 
