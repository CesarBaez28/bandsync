'use client';

import styles from '@/ui/musicalbands/setlists/setlists-content.module.css';
import stylesForm from '@/app/styles/form.module.css';
import { Repertoire } from "@/app/lib/definitions";
import { useForm } from 'react-hook-form';
import { createSetListSchema, CreateSetListSchema } from '@/app/lib/schemas/createSetListSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState, useEffect, useRef } from 'react';
import CustomInput from '@/ui/inputs/CustomInput';
import CustomTextArea from '@/ui/inputs/CustomTextArea';
import CustomSelect, { OptionInputSelect } from '@/ui/inputs/CustomSelect';
import CustomLink from '@/ui/link/CustomLink';
import CustomButton from '../../button/CustomButton';
import Modal from '../../modal/Modal';
import AddIcon from '@/public/add_2_24dp.svg';
import clsx from 'clsx';
import MusicNote from '@/public/music_note_2_24dp.svg';
import {
  DndContext,
  DragOverlay,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableSetItem from './SortableSetItem';
import { UUID } from 'node:crypto';
import SortableSongItem from './SortableSongItem';
import { useSetListForm } from './useSetListForm';
import { DragOverlaySet } from './DragOverlaySet';
import { DragOverlaySong } from './DragOverlaySong';
import { createSetListAction, SetListState } from '@/app/lib/actions/setlists';
import { useToast } from '../../toast/ToastContext';
import { useRouter } from 'next/navigation';

type Props = {
  readonly hypName: string;
  readonly musicalBandId: UUID | undefined;
  readonly repertoires: Repertoire[] | undefined;
}

export default function Form({ hypName, musicalBandId, repertoires }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: SetListState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<SetListState, FormData>(createSetListAction, initialState);

  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      showToast('Set List registrado con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/setlists`);
    }
  }, [state, hypName, router, showToast])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreateSetListSchema>({
    resolver: zodResolver(createSetListSchema),
    mode: "onChange",
  });

  const selectedRepertoire = watch("repertoire");

  const { songOptions,
    selectedSong,
    setSelectedSong,
    setName,
    setSetName,
    newSets,
    selectedSongs,
    activeSet,
    activeSetIndex,
    activeSelectedSong,
    activeSelectedSongIndex,
    openModal,
    editingSetUid,
    sensors,
    handleOpenModal,
    handleCancelModal,
    handleDragStartSets,
    handleDragEndSets,
    handleDragStartSelectedSongs,
    handleSaveSet,
    handleDeleteSet,
    handleSetSongsReorder,
    handleEditSet,
    handleDragEnd,
    handleAddSong,
    handleDeleteSong,
    handleSongNotesChange,
    handleDeleteSongFromSet
  } = useSetListForm({ musicalBandId, selectedRepertoire })

  const repertoiresOptions: OptionInputSelect[] | undefined = repertoires
    ?.toSorted((a, b) => a.name.localeCompare(b.name))
    .map((repertoire) => (
      { label: repertoire.name, value: repertoire.id.toString() }
    ))

  const onSubmit = () => {
    if (!formRef.current) return;
    const form = formRef.current;

    const formData = new FormData(form);

    formData.set(
      'sets',
      JSON.stringify(
        newSets.map((set) => ({
          name: set.name,
          orderIndex: set.index,
          songs: set.songs.map((song) => ({
            id: song.id,
            orderIndex: song.index,
            notes: song.notes ?? '',
          })),
        }))
      )
    );

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div id="modal-root" style={{ marginTop: '1rem' }}>

      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={stylesForm.fieldsContainer + ' col-12 col-sm-8 col-md-6 col-lg-5'}>

          <CustomInput
            label='Nombre:'
            type='text'
            {...register("name")}
            error={errors.name}
          />

          <CustomSelect
            label="Repertorio:"
            options={repertoiresOptions}
            {...register("repertoire")}
            error={errors.repertoire}
          />

          <CustomTextArea
            label='Descripción:'
            {...register("description")}
            error={errors.description}
          />

          <input type="hidden" name="musicalBandId" value={musicalBandId} />

          {state?.message && (
            <p className={stylesForm.errorMessage}>
              {state?.message}
            </p>
          )}

        </div>

        <div className={stylesForm.fieldsContainer} style={{ marginTop: '25px' }}>

          <div className={stylesForm.buttonsContainer}>
            <CustomLink buttonStyle={true} href={`/musicalbands/${hypName}/setlists`} variant='secondary'>
              Cancelar
            </CustomLink>
            <CustomButton type="button" variant='secondary' onClick={handleOpenModal}>
              Agregar set
            </CustomButton>
            <CustomButton type='submit' isLoading={isPending}>
              Guardar
            </CustomButton>
          </div>

        </div>

        {newSets.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStartSets}
            onDragEnd={handleDragEndSets}
          >
            <SortableContext items={newSets.map((s) => s.uid)} strategy={verticalListSortingStrategy}>
              <div className={styles.setsList}>
                {newSets.map((set, idx) => (
                  <SortableSetItem
                    key={set.uid}
                    setSongs={set}
                    index={idx}
                    onDelete={handleDeleteSet}
                    onDeleteSong={handleDeleteSongFromSet}
                    onEdit={handleEditSet}
                    onSongsReorder={handleSetSongsReorder}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={null}>
              <DragOverlaySet activeSet={activeSet} activeSetIndex={activeSetIndex} />
            </DragOverlay>
          </DndContext>
        ) :
          <div className={styles.emptyState}>
            <MusicNote width={32} height={32} className={styles.emptyStateIcon} />
            <div className={styles.emptyStateText}>
              <h3 className={styles.emptyStateTitle}>Todavía no ha agregado ningún set</h3>
              <p className={styles.emptyStateDescription}>Lo puede hacer haciendo clic en el botón Agregar set</p>
            </div>
          </div>
        }

      </form>

      <Modal
        size='md'
        isOpen={openModal}
        title={editingSetUid ? 'Editar set' : 'Agregar set'}
      >

        <form className={stylesForm.fieldsContainer}>

          <CustomInput
            label='Nombre:'
            placeholder='Nombre del set'
            name='set'
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />

          <div className={clsx(
            stylesForm.inputWithButtonContainer, stylesForm.alingItemsFlexEnd
          )}>
            <CustomSelect
              label='Canción:'
              placeholder='Añadir canciones'
              fullWidth={true}
              name="songs"
              options={songOptions}
              value={selectedSong}
              onChange={(e) => setSelectedSong(e.target.value)}
            />

            <CustomButton type='button' onClick={handleAddSong}>
              <AddIcon width={16} height={16} />
            </CustomButton>
          </div>

          {selectedSongs.length !== 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStartSelectedSongs}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedSongs.map((song) => song.uid)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.selectedSongsList}>
                  <p className={styles.selectedSongsTitle}>Orden de canciones</p>
                  {selectedSongs.map((song, index) => (
                    <SortableSongItem
                      key={song.uid}
                      song={song}
                      index={index}
                      onDelete={handleDeleteSong}
                      onNotesChange={handleSongNotesChange}
                      showNotesEditor={true}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={null}>
                <DragOverlaySong
                  activeSelectedSong={activeSelectedSong}
                  activeSelectedSongIndex={activeSelectedSongIndex}
                />
              </DragOverlay>
            </DndContext>
          ) : (
            <div className={styles.emptyState}>
              <MusicNote width={32} height={32} className={styles.emptyStateIcon} />
              <div className={styles.emptyStateText}>
                <h3 className={styles.emptyStateTitle}>Este set aún no tiene canciones</h3>
                <p className={styles.emptyStateDescription}>Agregue las canciones que desea para este set</p>
              </div>
            </div>
          )
          }

          <div className={stylesForm.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={handleCancelModal}>
              Cancelar
            </CustomButton>
            <CustomButton type="button" onClick={handleSaveSet}>
              {editingSetUid ? 'Actualizar' : 'Guardar'}
            </CustomButton>
          </div>

        </form>

      </Modal>

    </div>
  )
}