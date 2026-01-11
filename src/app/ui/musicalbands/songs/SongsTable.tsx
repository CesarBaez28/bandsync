'use client';

import stylesForm from "../../../styles/form.module.css"
import stylesModal from "../../../styles/modal.module.css";
import { PagedData, Song } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";
import CustomLink from "../../link/CustomLink";
import { useActionState, useCallback, useEffect, useState } from "react";
import Modal from "../../modal/Modal";
import { deleteSongAction, DeleteSongActionState } from "@/app/lib/actions/songs";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { useToast } from "../../toast/ToastContext";
import { Can } from "../../authorization/Can";
import { UserPermissions } from "@/app/lib/permisions";

type SongsTableProps = {
  readonly data: PagedData<Song> | undefined;
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
};

export default function SongsTable({ data, musicalBandId, hypName }: SongsTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const initialDeleteState: DeleteSongActionState = { message: null, success: false };
  const [deleteState, formDeleteAction, isDeletingPending] = useActionState<DeleteSongActionState, FormData>(deleteSongAction, initialDeleteState);

  const handleDelete = (song: Song) => {
    setSelectedSong(song);
    setOpenModal(true);
  }

  const handleCancel = useCallback(() => {
    setOpenModal(false);
  }, []);

  useEffect(() => {
    if (deleteState?.success) {
      handleCancel();
      showToast('Canción eliminada correctamente!', 'success');
      router.push(`/musicalbands/${hypName}/songs`);
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
              <th>Artista</th>
              <th>Género</th>
              <th>Tonalidad</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((song) => (
              <tr key={song.id}>
                <td>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <Can permission={UserPermissions.UPDATE_SONG} musicalBandId={musicalBandId}>
                      <CustomLink href={`/musicalbands/${hypName}/songs/${song.id}/edit`} variant="tertiary">
                        <Image src="/edit_24dp.svg" alt="Editar" width={24} height={24} />
                      </CustomLink>
                    </Can>
                    <Can permission={UserPermissions.DELETE_SONG} musicalBandId={musicalBandId}>
                      <CustomButton onClick={() => handleDelete(song)} variant="tertiary" type="button">
                        <Image src="/delete_24dp.svg" alt="Eliminar" width={24} height={24} />
                      </CustomButton>
                    </Can>
                    <CustomLink href={song.link} variant="tertiary">
                      <Image src="/link_24dp.svg" alt="Link canción" width={24} height={24} />
                    </CustomLink>
                    <CustomLink href={song.sheetMusic} variant="tertiary">
                      <Image src="/docs_24dp.svg" alt="Archivo o partitura de la canción" width={24} height={24} />
                    </CustomLink>
                  </div>
                </td>
                <td>{song.name}</td>
                <td>{song.artist.name}</td>
                <td>{song.genre.name}</td>
                <td>{song.tonality}</td>
              </tr>
            ))}
          </tbody>
        </table>) : (
        <div className="message">
          <h2>¡No se encontraron resultados!</h2>
          <p>Registre una canción usando el botón Agregar o cambie los valores de su búsqueda</p>
        </div>)
      }

      <Modal
        size="sm"
        isOpen={openModal}
        title="Eliminar Canción"
      >
        <form action={formDeleteAction} className={stylesModal.modalContent}>

          <h3 className={stylesModal.titleSize}>¿Estas seguro de realizar esta acción?</h3>

          <p>Toda la información relacionada con esta canción será eliminada </p>

          {deleteState?.message && (
            <p className={stylesForm.errorMessage}>
              {deleteState?.message}
            </p>
          )}

          <input type="hidden" name="id" value={selectedSong?.id} />
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