'use client';

import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import styles from './input-container.module.css';
import stylesForm from '../../../styles/form.module.css';
import Search from '../../search/Search';
import CustomButton from '../../button/CustomButton';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast/ToastContext';
import { createMusicalRoleAction, MusicalRoleActionState } from '@/app/lib/actions/muscalRoles';
import { useForm } from 'react-hook-form';
import { musicalRoleSchema, MusicalRoleSchema } from '@/app/lib/schemas/musicalRolesSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../../modal/Modal';
import CustomInput from '../../Inputs/CustomInput';

type InputContainerProps = {
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string
}

export default function InputContainer({ musicalBandId, hypName }: InputContainerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: MusicalRoleActionState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<MusicalRoleActionState, FormData>(createMusicalRoleAction, initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MusicalRoleSchema>({
    resolver: zodResolver(musicalRoleSchema),
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
      showToast('Role musical registrado con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/musical-roles`);
    }
  }, [state, showToast, handleCancel, hypName, router]);

  return (
    <div id="modal-root" className={styles.inputContainer}>
      <Search placeholder="Escriba nombre del role musical" />
      <CustomButton variant="primary" type="button" onClick={() => setOpen(true)}>
        Agregar
      </CustomButton>

      <Modal
        size="sm"
        isOpen={open}
        title="Crear Role Musical"
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
  );
}