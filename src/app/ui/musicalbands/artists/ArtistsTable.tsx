'use client';

import { Artist, PagedData } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "../../toast/ToastContext";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import { ArtistActionState, updateArtistAction } from "@/app/lib/actions/artists";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArtistSchema, artistSchema } from "@/app/lib/schemas/artistSchema";
import { useForm } from "react-hook-form";
import Modal from "../../modal/Modal";
import CustomInput from "../../Inputs/CustomInput";
import stylesForm from "../../../styles/form.module.css"

type ArtistTableProps = {
  readonly data: PagedData<Artist> | undefined;
  readonly hypName: string
};

export default function ArtistTable({ data, hypName }: ArtistTableProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: ArtistActionState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<ArtistActionState, FormData>(updateArtistAction, initialState);

  const handleEdit = ({ id, name, status }: Artist) => {
    setSelectedArtist({ id, name, status });
    setOpen(true)
  }

  const handleDelete = ({ id, name, status }: Artist) => {
    setSelectedArtist({ id, name, status });
  }

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
    if (selectedArtist) {
      reset({
        name: selectedArtist.name,
      });
    }
  }, [selectedArtist, reset]);

  useEffect(() => {
    if (state?.success) {
      handleCancel();
      showToast('Artista actualizado con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/artists`);
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
          {data?.content.map((artist) => (
            <tr key={artist.id}>
              <td>
                <div style={{ display: 'flex', gap: '.6rem' }}>
                  <CustomButton onClick={() => handleEdit(artist)} variant="tertiary" type="button">
                    <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                  </CustomButton>
                  <CustomButton onClick={() => handleDelete(artist)} variant="tertiary" type="button">
                    <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                  </CustomButton>
                </div>
              </td>
              <td>{artist.name}</td>
            </tr>
          ))}
        </tbody>
      </table>) : (
      <div className="message">
        <h2>¡No se encontraron resultados!</h2>
        <p>Registre un artista usando el botón Agregar o cambie los valores de su búsqueda</p>
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

          <input type="hidden" name="id" value={selectedArtist?.id} />

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