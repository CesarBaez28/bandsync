'use client';

import Search from '../../search/Search';
import styles from '../../../styles/input-container.module.css';
import stylesForm from '../../../styles/form.module.css'
import CustomButton from '../../button/CustomButton';
import Modal from '../../modal/Modal';
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import CustomInput from '../../Inputs/CustomInput';
import { InvitationState, sendInvitationEmailAction } from '@/app/lib/actions/musicalbands';
import { sendInvitationSchema, SendInvitationSchema } from '@/app/lib/schemas/sendInvitationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast/ToastContext';
import { UUID } from 'crypto';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';

type Props = {
  readonly hypName: string;
  readonly musicalBandId: UUID | undefined;
  readonly userId: UUID | undefined;
}

export default function InputContainer({ hypName, musicalBandId, userId }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: InvitationState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<InvitationState, FormData>(sendInvitationEmailAction, initialState);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SendInvitationSchema>({
    resolver: zodResolver(sendInvitationSchema),
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
    setOpenModal(false);
  }, [reset, state]);

  useEffect(() => {
    if (state?.success) {
      handleCancel();
      showToast('Se ha enviado la invitación!', 'success');
      router.push(`/musicalbands/${hypName}/users`);
    }
  }, [state, handleCancel, showToast, router, hypName]);

  return (
    <div id='modal-root' className={styles.inputContainer}>
      <Search placeholder="Nombre, apellido, email..." />

      <Can
        permission={UserPermissions.ADD_MEMBER}
        musicalBandId={musicalBandId}
      >
        <CustomButton type='button' onClick={() => setOpenModal(true)}>
          Agregar
        </CustomButton>
      </Can>


      <Modal
        size="sm"
        isOpen={openModal}
        title="Enviar invitación"
      >
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={stylesForm.fieldsContainer}>
            <CustomInput
              label='Correo electrónico:'
              type='email'
              {...register("email")}
              error={errors.email}
            />

            <input type="hidden" name="musicalBandId" value={musicalBandId} />
            <input type="hidden" name="userId" value={userId} />

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