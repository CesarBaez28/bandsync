'use client';

import stylesForm from '../../../styles/form.module.css'
import CustomButton from "../../button/CustomButton";
import { Dispatch, SetStateAction, startTransition, useActionState, useCallback, useEffect, useState } from "react";
import { useToast } from "../../toast/ToastContext";
import { ArtistActionState, createArtistAction } from "@/app/lib/actions/artists";
import { useForm } from "react-hook-form";
import CustomInput from "../../inputs/CustomInput";
import Modal from "../../modal/Modal";
import { zodResolver } from '@hookform/resolvers/zod';
import { ArtistSchema, artistSchema } from '@/app/lib/schemas/artistSchema';
import { UUID } from 'node:crypto';
import { Artist } from '@/app/lib/definitions';
import AddIcon from '@/public/add_2_24dp.svg'

type Props = {
  readonly musicalBandId: UUID | undefined;
  readonly setArtistsState: Dispatch<SetStateAction<Artist[] | undefined>>;
}

export default function AddArtist({ musicalBandId, setArtistsState }: Props) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const initialState: ArtistActionState = { errors: {}, message: null, success: false, data: undefined };
  const [state, formAction, isPending] = useActionState<ArtistActionState, FormData>(
    createArtistAction,
    initialState
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ArtistSchema>({
    resolver: zodResolver(artistSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ArtistSchema) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("musicalBandId", musicalBandId ?? "");

    startTransition(() => formAction(fd));
  };

  const handleCancel = useCallback(() => {
    setValue("name", "");
    setOpen(false);
  }, [setValue]);

  const { success, data: createdArtist } = state;

  useEffect(() => {
    if (!success || !createdArtist) return;

    setArtistsState(prev => prev ? [createdArtist, ...prev] : [createdArtist]);

    handleCancel();
    showToast("Artista registrado con éxito!", "success");

  }, [success, createdArtist, setArtistsState, handleCancel, showToast]);

  return (
    <div id='modal-root'>
      <CustomButton type='button' style={{ height: '50%' }} onClick={() => setOpen(true)}>
        <AddIcon width={16} height={16} />
      </CustomButton>

      <Modal size="sm" isOpen={open} title="Crear Artista">
        <div className={stylesForm.fieldsContainer}>

          <CustomInput
            label='Nombre:'
            type='text'
            {...register("name")}
            error={errors.name}
          />

          {state?.message && (
            <p className={stylesForm.errorMessage}>{state.message}</p>
          )}

          <div className={stylesForm.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleCancel}>
              Cancelar
            </CustomButton>

            <CustomButton
              isLoading={isPending}
              type='button'
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
