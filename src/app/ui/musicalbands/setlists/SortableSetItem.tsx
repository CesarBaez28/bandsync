import { useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import Accordion from '@/app/ui/accordion/Accordion';
import styles from '@/ui/musicalbands/setlists/setlists-content.module.css';
import { useSortable, SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, DragOverlay, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { SetSongs, SongItem } from './useSetListForm';
import SortableSongItem from './SortableSongItem';
import DeleteIcon from '@/public/delete_24dp.svg';
import EditIcon from '@/public/edit_24dp.svg';
import CustomButton from '@/ui/button/CustomButton';
import MusicNote from '@/public/music_note_2_24dp.svg';
import DragIndicator from '@/public/drag_indicator_24dp.svg';

type SortableSetItemProps = {
  readonly setSongs: SetSongs;
  readonly index: number;
  readonly onDelete: (uid: string) => void;
  readonly onDeleteSong: (setId: string, songId: string) => void;
  readonly onEdit: (uid: string) => void;
  readonly onSongsReorder: (setUid: string, songs: SongItem[]) => void;
};

export default function SortableSetItem({ setSongs, index, onDelete, onDeleteSong, onEdit, onSongsReorder }: SortableSetItemProps) {
  const [activeSongId, setActiveSongId] = useState<string | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: setSongs.uid });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    pointerEvents: isDragging ? 'none' : 'auto',
  };

  const activeSong = activeSongId ? setSongs.songs.find((song) => song.uid === activeSongId) : null;
  const activeSongIndex = activeSong ? setSongs.songs.findIndex((song) => song.uid === activeSongId) : -1;

  const handleSongDragStart = ({ active }: DragStartEvent) => {
    setActiveSongId(active.id as string);
  };

  const handleSongDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveSongId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = setSongs.songs.findIndex((song) => song.uid === active.id);
    const newIndex = setSongs.songs.findIndex((song) => song.uid === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    onSongsReorder(setSongs.uid, arrayMove(setSongs.songs, oldIndex, newIndex));
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.setItem}>
      <Accordion
        header={
          <div className={styles.setHeader}>
            <div className={styles.setHeaderTitle}>
              <CustomButton
                variant='tertiary'
                type='button'
                className={styles.dragHandle}
                {...attributes}
                {...listeners}
                onPointerDown={(event: React.PointerEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  const listener = (listeners as { onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void }).onPointerDown;
                  listener?.(event);
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                aria-label='Arrastrar set'
              >
                <DragIndicator width={20} height={20} />
              </CustomButton>
              <span className={styles.setTitle}>{index + 1}. {setSongs.name}</span>
            </div>
            <div className={styles.setHeaderMeta}>
              <span className={styles.setMeta}>Canciones: {setSongs.songs.length}</span>
            </div>
          </div>
        }
        actions={
          <div className={styles.setActions}>
            <CustomButton
              variant='tertiary'
              type='button'
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(setSongs.uid);
              }}
            >
              <EditIcon width={24} height={24} />
            </CustomButton>
            <CustomButton
              variant='tertiary'
              type='button'
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(setSongs.uid);
              }}
            >
              <DeleteIcon width={24} height={24} />
            </CustomButton>
          </div>
        }
      >
        <div className={styles.setSongsList}>
          {setSongs.songs.length > 0 ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragStart={handleSongDragStart}
              onDragEnd={handleSongDragEnd}
            >
              <SortableContext items={setSongs.songs.map((song) => song.uid)} strategy={verticalListSortingStrategy}>
                {setSongs.songs.map((s, songIndex) => (
                  <SortableSongItem
                    key={s.uid}
                    song={s}
                    index={songIndex}
                    onDelete={(songId) => onDeleteSong(setSongs.uid, songId)}
                  />
                ))}
              </SortableContext>

              <DragOverlay dropAnimation={null}>
                {activeSong ? (
                  <div className={`${styles.selectedSongItem} ${styles.songDragOverlay}`}>
                    <div className={styles.header}>
                      <div className={styles.headerContent}>
                        <span className={styles.songOrderBadge}>{activeSongIndex + 1}</span>
                        <div className={styles.songDetails}>
                          <span className={styles.songName}>{activeSong.name}</span>
                          <span className={styles.songSubtext}>{activeSong.artist.name}</span>
                        </div>
                      </div>
                    </div>
                    {activeSong.notes ? (
                      <div className={styles.notesPreviewContainer}>
                        <span className={styles.songNotesPreview}>{activeSong.notes}</span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className={styles.emptyState}>
              <MusicNote width={32} height={32} className={styles.emptyStateIcon} />
              <div className={styles.emptyStateText}>
                <h3 className={styles.emptyStateTitle}>No hay canciones añadidas en este set</h3>
                <p className={styles.emptyStateDescription}>Puede agregar las canciones dando clic en el botón editar más abajo</p>
              </div>
            </div>
          )}
        </div>
      </Accordion>
    </div>
  );
}
