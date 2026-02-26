'use client';

import stylesForm from "../../../styles/form.module.css";
import { MusicalGenre, PagedData } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../toast/ToastContext";
import { deleteMusicalGenreAction, DeleteMusicalGenreActionState, MusicalGenreActionState, updateMusicalGenreAction } from "@/app/lib/actions/musicalGenres";
import { useForm } from "react-hook-form";
import { musicalGenreSchema, MusicalGenreSchema } from "@/app/lib/schemas/musicalGenteSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../../modal/Modal";
import CustomButton from "../../button/CustomButton";
import CustomInput from "../../Inputs/CustomInput";
import stylesModal from "../../../styles/modal.module.css";
import { UUID } from "crypto";
import { Can } from "../../authorization/Can";
import { UserPermissions } from "@/app/lib/permisions";
import EditIcon from "@/public/edit_24dp.svg";
import DeleteIcon from "@/public/delete_24dp.svg";

type MusicalGenresTableProps = {
  readonly data: PagedData<MusicalGenre> | undefined;
  readonly hypName: string;
  readonly musicalBandId?: UUID;
};

export default function MusicalGenresTable({ data, hypName, musicalBandId }: MusicalGenresTableProps) {
  const [selectedMusicalGenre, setSelectedMusicalGenre] = useState<MusicalGenre | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: MusicalGenreActionState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<MusicalGenreActionState, FormData>(updateMusicalGenreAction, initialState);
  const initialDeleteState: DeleteMusicalGenreActionState = { message: null, success: false };
  const [deleteState, formDeleteAction, isDeletingPending] = useActionState<DeleteMusicalGenreActionState, FormData>(deleteMusicalGenreAction, initialDeleteState);

  const handleEdit = ({ id, name, status }: MusicalGenre) => {
    setSelectedMusicalGenre({ id, name, status });
    setOpenUpdateModal(true)
  }

  const handleDelete = ({ id, name, status }: MusicalGenre) => {
    setSelectedMusicalGenre({ id, name, status });
    setOpenDeleteModal(true);
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
    deleteState.message = null;
    deleteState.success = false;
    setOpenUpdateModal(false);
    setOpenDeleteModal(false);
  }, [reset, formRef, state, deleteState]);

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
    if (deleteState?.success) {
      handleCancel();
      showToast("Género musical eliminado con éxito!", 'success');
      router.push(`/musicalbands/${hypName}/genres`);
    }
  }, [state, deleteState, showToast, handleCancel, hypName, router]);

  return <div className="modal-root">
    {(data?.content?.length ?? 0) > 0 ? (
      <table>
        <thead>
          <tr>
            <Can anyOf={[UserPermissions.UPDATE_MUSICAL_GENRE, UserPermissions.DELETE_MUSICAL_GENRE]} musicalBandId={musicalBandId}>
              <th>Acciones</th>
            </Can>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((musicalGenre) => (
            <tr key={musicalGenre.id}>
              <Can anyOf={[UserPermissions.UPDATE_MUSICAL_GENRE, UserPermissions.DELETE_MUSICAL_GENRE]} musicalBandId={musicalBandId}>
                <td>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <Can permission={UserPermissions.UPDATE_MUSICAL_GENRE} musicalBandId={musicalBandId}>
                      <CustomButton onClick={() => handleEdit(musicalGenre)} variant="tertiary" type="button">
                        <EditIcon width={24} height={24} />
                      </CustomButton>
                    </Can>
                    <Can permission={UserPermissions.DELETE_MUSICAL_GENRE} musicalBandId={musicalBandId}>
                      <CustomButton onClick={() => handleDelete(musicalGenre)} variant="tertiary" type="button">
                        <DeleteIcon width={24} height={24} />
                      </CustomButton>
                    </Can>
                  </div>
                </td>
              </Can>
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
      isOpen={openUpdateModal}
      title="Actualizar Género Musical"
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
      title="Eliminar Género Musical"
    >

      <form action={formDeleteAction} className={stylesModal.modalContent}>

        <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

        <p>Toda la información relacionada con este género musical será eliminada </p>

        {deleteState?.message && (
          <p className={stylesForm.errorMessage}>
            {deleteState?.message}
          </p>
        )}

        <input type="hidden" name="id" value={selectedMusicalGenre?.id} />
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