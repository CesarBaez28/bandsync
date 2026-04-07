'use client';

import stylesForm from '../../../styles/form.module.css'
import { MusicalGenre } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import { Dispatch, SetStateAction, startTransition, useActionState, useCallback, useEffect, useState } from "react";
import { useToast } from "../../toast/ToastContext";
import { useForm } from "react-hook-form";
import { musicalGenreSchema, MusicalGenreSchema } from "@/app/lib/schemas/musicalGenteSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMusicalGenreAction, MusicalGenreActionState } from "@/app/lib/actions/musicalGenres";
import CustomButton from "../../button/CustomButton";
import Modal from "../../modal/Modal";
import CustomInput from "../../Inputs/CustomInput";
import AddIcon from '@/public/add_2_24dp.svg'

type Props = {
  readonly musicalBandId: UUID | undefined;
  readonly setGenresState: Dispatch<SetStateAction<MusicalGenre[] | undefined>>;
}

export default function AddGenre({ musicalBandId, setGenresState }: Props) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const initialState: MusicalGenreActionState = { errors: {}, message: null, success: false, data: undefined };
  const [state, formAction, isPending] = useActionState<MusicalGenreActionState, FormData>(createMusicalGenreAction, initialState);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<MusicalGenreSchema>({
    resolver: zodResolver(musicalGenreSchema),
    mode: "onChange",
  });

  const onSubmit = (data: MusicalGenreSchema) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("musicalBandId", musicalBandId ?? "");

    startTransition(() => formAction(fd));
  };

  const handleCancel = useCallback(() => {
    setValue("name", "")
    setOpen(false);
  }, [setValue]);

  const { success, data: createdGenre } = state;

  useEffect(() => {
    if (!success || !createdGenre) return;

    setGenresState(prev => prev ? [createdGenre, ...prev] : [createdGenre]);

    handleCancel();
    showToast("Género musical creado con éxito!", "success");

  }, [success, createdGenre, setGenresState, handleCancel, showToast]);

  return (
    <div id="modal-root">
      <CustomButton type='button' style={{ height: '50%' }} onClick={() => setOpen(true)}>
        <AddIcon width={16} height={16} />
      </CustomButton>

      <Modal size="sm" isOpen={open} title="Crear género musical">
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