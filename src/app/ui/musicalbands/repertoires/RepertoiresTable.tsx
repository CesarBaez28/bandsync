'use client';

import stylesForm from "../../../styles/form.module.css"
import stylesModal from "../../../styles/modal.module.css";
import { PagedData, Repertoire } from "@/app/lib/definitions";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { useToast } from "../../toast/ToastContext";
import { useActionState, useCallback, useEffect, useState } from "react";
import CustomLink from "../../link/CustomLink";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";
import Modal from "../../modal/Modal";
import { deleteRepertoireAction, DeleteRepertoireActionState } from "@/app/lib/actions/repertoires";

type RepertoiresTableProps = {
  readonly data: PagedData<Repertoire> | undefined;
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
};

export default function RepertoiresTable({ data, musicalBandId, hypName }: RepertoiresTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedRepertoire, setSelectedRepertoire] = useState<Repertoire | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const initialDeleteState: DeleteRepertoireActionState = { message: null, success: false };
  const [deleteState, formDeleteAction, isDeletingPending] = useActionState<DeleteRepertoireActionState, FormData>(deleteRepertoireAction, initialDeleteState);

  const handleDelete = (repertoire: Repertoire) => {
    setSelectedRepertoire(repertoire);
    setOpenModal(true);
  }

  const handleCancel = useCallback(() => {
    setOpenModal(false);
  }, []);

  useEffect(() => {
    if (deleteState?.success) {
      handleCancel();
      showToast('Canción eliminada correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/repertoires`);
    }
  }, [deleteState, showToast, handleCancel, hypName, router]);

  return (
    <div id="modal-root">
      {(data?.content?.length ?? 0) > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((repertoire) => (
              <tr key={repertoire.id}>
                <td>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <CustomLink href={`/musicalbands/${hypName}/repertoires/${repertoire.id}/edit`} variant="tertiary">
                      <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                    </CustomLink>
                    <CustomButton onClick={() => handleDelete(repertoire)} variant="tertiary" type="button">
                      <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                    </CustomButton>
                    <CustomLink href={repertoire.link} variant="tertiary">
                      <Image src="/link_24dp.svg" alt="Editar" width={24} height={24} />
                    </CustomLink>
                    <CustomLink href={`/musicalbands/${hypName}/repertoires/${repertoire.id}/see`} variant="tertiary">
                    <Image src={'/opsz24.svg'} alt="Visualizar canciones del repertorio" width={24} height={24}/>
                    </CustomLink>
                  </div>
                </td>
                <td>{repertoire.name}</td>
                <td>{repertoire.description}</td>
              </tr>
            ))}
          </tbody>
        </table>) : (
        <div className="message">
          <h2>¡No se encontraron resultados!</h2>
          <p>Registre un repertorio usando el botón Agregar o cambie los valores de su búsqueda</p>
        </div>)
      }

      <Modal
        size="sm"
        isOpen={openModal}
        title="Eliminar repertorio"
      >
        <form action={formDeleteAction} className={stylesModal.modalContent}>

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          <p>Toda la información relacionada con este repertorio será eliminada </p>

          {deleteState?.message && (
            <p className={stylesForm.errorMessage}>
              {deleteState?.message}
            </p>
          )}

          <input type="hidden" name="id" value={selectedRepertoire?.id} />
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
  )
}