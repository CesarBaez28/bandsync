'use client'

import stylesResponsive from '@/app/styles/responsive.module.css';
import stylesForm from "@/app/styles/form.module.css"
import stylesModal from "@/app/styles/modal.module.css";

import { PagedData, Setlist } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import CustomLink from '../../link/CustomLink';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import CustomButton from '../../button/CustomButton';

import EditIcon from '@/public/edit_24dp.svg';
import DeleteIcon from '@/public/delete_24dp.svg';
import SeeIcon from '@/public/opsz24.svg'
import { useActionState, useCallback, useEffect, useState } from 'react';
import { formatDate } from '@/app/lib/utils';
import SetListsAccordion from './SetListsAccordion';
import Modal from '../../modal/Modal';
import { deleteSetListAction, DeleteSetListState } from '@/app/lib/actions/setlists';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast/ToastContext';

type Props = {
  readonly data: PagedData<Setlist> | undefined;
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
};

export default function SetListsContent({ data, musicalBandId, hypName }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedSetList, setSelectedSetList] = useState<Setlist | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const initialState: DeleteSetListState = { success: false, message: null };
  const [deleteState, formAction, isPending] = useActionState<DeleteSetListState, FormData>(deleteSetListAction, initialState);

  const handleDelete = (setList: Setlist) => {
    setSelectedSetList(setList);
    setOpenModal(true);
  }

  const handleCancel = useCallback(() => {
    setOpenModal(false);
  }, []);

  useEffect(() => {
    if (deleteState?.success) {
      handleCancel();
      showToast('Set list eliminado correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/setlists`);
    }
  }, [deleteState, showToast, handleCancel, hypName, router]);

  return (
    <div id='modal-root'>
      {(data?.content?.length ?? 0) > 0 ? (
        <>
          <div className={stylesResponsive.desktopOnly}>
            <table>
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Repertorio</th>
                  <th>Fecha de Creación</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((setList) => (
                  <tr key={setList.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '.6rem' }}>
                        <CustomLink href={`/musicalbands/${hypName}/setlists/${setList.id}/see`} variant="tertiary">
                          <SeeIcon width={24} height={24} />
                        </CustomLink>
                        <Can permission={UserPermissions.UPDATE_SETLIST} musicalBandId={musicalBandId}>
                          <CustomLink href={`/musicalbands/${hypName}/setlists/${setList.id}/edit`} variant="tertiary">
                            <EditIcon width={24} height={24} />
                          </CustomLink>
                        </Can>
                        <Can permission={UserPermissions.DELETE_SETLIST} musicalBandId={musicalBandId}>
                          <CustomButton onClick={() => handleDelete(setList)} variant="tertiary" type="button">
                            <DeleteIcon width={24} height={24} />
                          </CustomButton>
                        </Can>
                      </div>
                    </td>
                    <td>{setList.name}</td>
                    <td>{setList.description}</td>
                    <td>{setList.repertoire.name}</td>
                    <td>{formatDate(new Date(setList.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={stylesResponsive.mobileOnly}>
            <SetListsAccordion
              data={data}
              musicalBandId={musicalBandId}
              hypName={hypName}
              onDelete={handleDelete}
            />
          </div>
        </>
      ) : (
        <div className="message">
          <h2>¡No se encontraron resultados!</h2>
          <p>Registre un Setlist usando el botón Agregar o cambie los valores de su búsqueda</p>
        </div>)
      }

      <Modal
        size="sm"
        isOpen={openModal}
        title="Eliminar Set List"
      >
        <form action={formAction} className={stylesModal.modalContent}>

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          <p>Toda la información relacionada con este set list será eliminada </p>

          {deleteState?.message && (
            <p className={stylesForm.errorMessage}>
              {deleteState?.message}
            </p>
          )}

          <input type="hidden" name="setlistId" value={selectedSetList?.id} />
          <input type="hidden" name="musicalBandId" value={musicalBandId} />

          <div className={stylesModal.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleCancel}>
              Cancelar
            </CustomButton>
            <CustomButton isLoading={isPending} type='submit'>
              Eliminar
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}