"use client";

import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import CustomButton from "../../button/CustomButton";
import Modal from "../../modal/Modal";
import Search from "../../search/Search";
import styles from './input-container.module.css';
import stylesForm from '../../../styles/form.module.css'
import { createArtistAction, ArtistActionState } from "@/app/lib/actions/artists";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArtistSchema, artistSchema } from "@/app/lib/schemas/artistSchema";
import CustomInput from "../../Inputs/CustomInput";
import { UUID } from "crypto";
import { useToast } from "../../toast/ToastContext";
import { useRouter } from "next/navigation";

export default function InputContainer({ musicalBandId, hypName }: { readonly musicalBandId: UUID | undefined, readonly hypName: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: ArtistActionState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<ArtistActionState, FormData>(createArtistAction, initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ArtistSchema>({
    resolver: zodResolver(artistSchema),
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
      showToast('Artista registrado con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/artists`);
    }
  }, [state, showToast, handleCancel, hypName, router]);

  return (
    <div id="modal-root" className={styles.inputContainer}>

      <Search placeholder="Escriba nombre del artista" />
      <CustomButton variant="primary" type="button" onClick={() => setOpen(true)}>
        Agregar
      </CustomButton>

      <Modal
        size="sm"
        isOpen={open}
        title="Crear Artista"
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