'use client';

import { Artist, PagedData } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import { useRouter } from "next/navigation";
import { useToast } from "../../toast/ToastContext";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import { ArtistActionState, deleteArtistAction, DeleteArtistActionState, updateArtistAction } from "@/app/lib/actions/artists";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArtistSchema, artistSchema } from "@/app/lib/schemas/artistSchema";
import { useForm } from "react-hook-form";
import Modal from "../../modal/Modal";
import CustomInput from "../../inputs/CustomInput";
import stylesForm from "../../../styles/form.module.css"
import stylesModal from "../../../styles/modal.module.css";
import { UUID } from "crypto";
import { Can } from "../../authorization/Can";
import { UserPermissions } from "@/app/lib/permisions";
import EditIcon from "@/public/edit_24dp.svg";
import DeleteIcon from "@/public/delete_24dp.svg";

type ArtistTableProps = {
  readonly data: PagedData<Artist> | undefined;
  readonly hypName: string;
  readonly musicalBandId?: UUID;
};

export default function ArtistTable({ data, hypName, musicalBandId }: ArtistTableProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: ArtistActionState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<ArtistActionState, FormData>(updateArtistAction, initialState);
  const initialDeleteState: DeleteArtistActionState = { message: null, success: false };
  const [deleteState, formDeleteAction, isDeletingPending] = useActionState<DeleteArtistActionState, FormData>(deleteArtistAction, initialDeleteState);

  const handleEdit = ({ id, name, status }: Artist) => {
    setSelectedArtist({ id, name, status });
    setOpenUpdateModal(true)
  }

  const handleDelete = ({ id, name, status }: Artist) => {
    setSelectedArtist({ id, name, status });
    setOpenDeleteModal(true);
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
    deleteState.message = null;
    deleteState.success = false;
    setSelectedArtist(null);
    setOpenUpdateModal(false);
    setOpenDeleteModal(false);
  }, [reset, formRef, state, deleteState]);

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
    if (deleteState?.success) {
      handleCancel();
      showToast('Artista eliminado correctamente', 'success');
      router.push(`/musicalbands/${hypName}/artists`);
    }
  }, [state, deleteState, showToast, handleCancel, hypName, router]);

  return <div className="modal-root">
    {(data?.content?.length ?? 0) > 0 ? (
      <table>
        <thead>
          <tr>
            <Can anyOf={[UserPermissions.DELETE_ARTIST, UserPermissions.UPDATE_ARTIST]} musicalBandId={musicalBandId}>
              <th>Acciones</th>
            </Can>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((artist) => (
            <tr key={artist.id}>
              <Can anyOf={[UserPermissions.DELETE_ARTIST, UserPermissions.UPDATE_ARTIST]} musicalBandId={musicalBandId}>
                <td>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <Can permission={UserPermissions.UPDATE_ARTIST} musicalBandId={musicalBandId}>
                      <CustomButton onClick={() => handleEdit(artist)} variant="tertiary" type="button">
                        <EditIcon width={24} height={24} />
                      </CustomButton>
                    </Can>
                    <Can permission={UserPermissions.DELETE_ARTIST} musicalBandId={musicalBandId}>
                      <CustomButton onClick={() => handleDelete(artist)} variant="tertiary" type="button">
                        <DeleteIcon width={24} height={24} />
                      </CustomButton>
                    </Can>
                  </div>
                </td>
              </Can>
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
      isOpen={openUpdateModal}
      title="Actualizar Artista"
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

    <Modal
      size="sm"
      isOpen={openDeleteModal}
      title="Eliminar Artista"
    >

      <form action={formDeleteAction} className={stylesModal.modalContent}>

        <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

        <p>Toda la información relacionada con este artista será eliminada </p>

        {deleteState?.message && (
          <p className={stylesForm.errorMessage}>
            {deleteState?.message}
          </p>
        )}

        <input type="hidden" name="id" value={selectedArtist?.id} />
        <input type="hidden" name="musicalBandId" value={musicalBandId} />

        <div className={stylesModal.buttonsContainer}>
          <CustomButton type='button' variant='secondary' onClick={handleCancel}>
            Cancelar
          </CustomButton>
          <CustomButton isLoading={isDeletingPending} type='submit'>
            Eliminar
          </CustomButton>
        </div>
      </form>
    </Modal>

  </div>
}