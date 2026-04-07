'use client';

import stylesForm from "../../../styles/form.module.css"
import stylesModal from "../../../styles/modal.module.css";
import { MusicalRole, PagedData } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../../toast/ToastContext";
import { deleteMusicalRoleAction, DeleteMusicalRoleActionState, MusicalRoleActionState, updateMusicalRoleAction } from "@/app/lib/actions/muscalRoles";
import Modal from "../../modal/Modal";
import CustomInput from "../../inputs/CustomInput";
import { musicalRoleSchema, MusicalRoleSchema } from "@/app/lib/schemas/musicalRolesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UUID } from "crypto";
import { Can } from "../../authorization/Can";
import { UserPermissions } from "@/app/lib/permisions";
import EditIcon from "@/public/edit_24dp.svg";
import DeleteIcon from "@/public/delete_24dp.svg";

type MusicalRoleTableProps = {
  readonly data: PagedData<MusicalRole> | undefined;
  readonly hypName: string;
  readonly musicalBandId?: UUID;
}

export default function MusicalRoleTable({ data, hypName, musicalBandId }: MusicalRoleTableProps) {
  const [selectedMusicalRole, setSelectedMusicalRole] = useState<MusicalRole | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: MusicalRoleActionState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<MusicalRoleActionState, FormData>(updateMusicalRoleAction, initialState);
  const initialDeleteState: DeleteMusicalRoleActionState = { message: null, success: false };
  const [deleteState, formDeleteAction, isDeletingPending] = useActionState<DeleteMusicalRoleActionState, FormData>(deleteMusicalRoleAction, initialDeleteState);

  const handleEdit = (role: MusicalRole) => {
    setSelectedMusicalRole(role);
    setOpenUpdateModal(true);
  };

  const handleDelete = (role: MusicalRole) => {
    setSelectedMusicalRole(role);
    setOpenDeleteModal(true);
  };

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
    deleteState.message = null;
    deleteState.success = false;
    setOpenUpdateModal(false);
    setOpenDeleteModal(false);
  }, [reset, formRef, state, deleteState]);

  useEffect(() => {
    if (selectedMusicalRole) {
      reset({
        name: selectedMusicalRole.name,
      });
    }
  }, [selectedMusicalRole, reset]);

  useEffect(() => {
    if (state?.success) {
      handleCancel();
      showToast('Role musical actualizado con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/musical-roles`);
    }
    if (deleteState?.success) {
      handleCancel();
      showToast('Role musical eliminado correctamente', 'success');
      router.push(`/musicalbands/${hypName}/musical-roles`);
    }
  }, [state, deleteState, showToast, handleCancel, hypName, router]);

  return (
    <div id="modal-root">
      {(data?.content?.length ?? 0) > 0 ? (
        <table>
          <thead>
            <tr>
              <Can anyOf={[UserPermissions.UPDATE_MUSICAL_ROLE, UserPermissions.DELETE_MUSICAL_ROLE]} musicalBandId={musicalBandId}>
                <th>Acciones</th>
              </Can>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((role) => (
              <tr key={role.id}>
                <Can anyOf={[UserPermissions.UPDATE_MUSICAL_ROLE, UserPermissions.DELETE_MUSICAL_ROLE]} musicalBandId={musicalBandId}>
                  <td>
                    <div style={{ display: 'flex', gap: '.6rem' }}>
                      <Can permission={UserPermissions.UPDATE_MUSICAL_ROLE} musicalBandId={musicalBandId}>
                        <CustomButton onClick={() => handleEdit(role)} variant="tertiary" type="button">
                          <EditIcon width={24} height={24} />
                        </CustomButton>
                      </Can>
                      <Can permission={UserPermissions.DELETE_MUSICAL_ROLE} musicalBandId={musicalBandId}>
                        <CustomButton onClick={() => handleDelete(role)} variant="tertiary" type="button">
                          <DeleteIcon width={24} height={24} />
                        </CustomButton>
                      </Can>
                    </div>
                  </td>
                </Can>
                <td>{role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>) : (
        <div className="message">
          <h2>¡No se encontraron resultados!</h2>
          <p>Registre un role musical usando el botón Agregar o cambie los valores de su búsqueda</p>
        </div>)
      }

      <Modal
        size="sm"
        isOpen={openUpdateModal}
        title="Actualizar Role Musical"
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

            <input type="hidden" name="id" value={selectedMusicalRole?.id} />
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
        title="Eliminar Role Musical"
      >

        <form action={formDeleteAction} className={stylesModal.modalContent}>

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          <p>Toda la información relacionada con este role musical será eliminada </p>

          {deleteState?.message && (
            <p className={stylesForm.errorMessage}>
              {deleteState?.message}
            </p>
          )}

          <input type="hidden" name="id" value={selectedMusicalRole?.id} />
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
  );
}   