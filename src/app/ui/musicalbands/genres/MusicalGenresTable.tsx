'use client';

import stylesForm from "../../../styles/form.module.css";
import { MusicalGenre, PagedData } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../toast/ToastContext";
import { MusicalGenreActionState, updateMusicalGenreAction } from "@/app/lib/actions/musicalGenres";
import { useForm } from "react-hook-form";
import { musicalGenreSchema, MusicalGenreSchema } from "@/app/lib/schemas/musicalGenteSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../../modal/Modal";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";
import CustomInput from "../../Inputs/CustomInput";

type MusicalGentesTableProps = {
  readonly data: PagedData<MusicalGenre> | undefined;
  readonly hypName: string
};

export default function MusicalGenresTable({ data, hypName }: MusicalGentesTableProps) {
  const [selectedMusicalGenre, setSelectedMusicalGenre] = useState<MusicalGenre | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: MusicalGenreActionState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<MusicalGenreActionState, FormData>(updateMusicalGenreAction, initialState);

  const handleEdit = ({ id, name, status }: MusicalGenre) => {
    setSelectedMusicalGenre({ id, name, status });
    setOpen(true)
  }

  const handleDelete = ({ id, name, status }: MusicalGenre) => {
    setSelectedMusicalGenre({ id, name, status });
  }

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
    if (selectedMusicalGenre) {
      reset({
        name: selectedMusicalGenre.name,
      });
    }
  }, [selectedMusicalGenre, reset]);

  useEffect(() => {
    if (state?.success) {
      handleCancel();
      showToast('Género musical actualizado con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/genres`);
    }
  }, [state, showToast, handleCancel, hypName, router]);

  return <div className="modal-root">
    {(data?.content?.length ?? 0) > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Acciones</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((musicalGenre) => (
            <tr key={musicalGenre.id}>
              <td>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <CustomButton onClick={() => handleEdit(musicalGenre)} variant="tertiary" type="button">
                    <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                  </CustomButton>
                  <CustomButton onClick={() => handleDelete(musicalGenre)} variant="tertiary" type="button">
                    <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                  </CustomButton>
                </div>
              </td>
              <td>{musicalGenre.name}</td>
            </tr>
          ))}
        </tbody>
      </table>) : (
      <div className="message">
        <h2>¡No se encontraron resultados!</h2>
        <p>Registre un género musical usando el botón Agregar o cambie los valores de su búsqueda</p>
      </div>)
    }

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

          <input type="hidden" name="id" value={selectedMusicalGenre?.id} />

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
}