import type { CSSProperties } from 'react';
import styles from '@/ui/musicalbands/setlists/setlists-content.module.css';
import { useSortable } from '@dnd-kit/sortable';
import type { SongItem } from './useSetListForm';
import { CSS } from '@dnd-kit/utilities';
import CustomButton from '@/ui/button/CustomButton';
import DeleteIcon from '@/public/delete_24dp.svg';
import CustomTextArea from '../../inputs/CustomTextArea';

type SortableSongItemProps = {
  readonly song: SongItem;
  readonly index: number;
  readonly onDelete?: (songId: string) => void;
  readonly onNotesChange?: (songId: string, notes: string) => void;
  readonly showNotesEditor?: boolean;
};

export function SortableSongItem({ song, index, onDelete, onNotesChange, showNotesEditor = false }: SortableSongItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: song.uid });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    pointerEvents: isDragging ? 'none' : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      data-song-item-id={song.uid}
      style={style}
      className={styles.selectedSongItem}
      {...attributes}
      {...listeners}
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.songOrderBadge}>{index + 1}</span>
          <div className={styles.songDetails}>
            <span className={styles.songName}>{song.name}</span>
            <span className={styles.songSubtext}>{song.artist.name}</span>
          </div>
        </div>

        {onDelete && (
          <div className={styles.songActions}>
            <CustomButton
              variant='tertiary'
              type='button'
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(song.uid);
              }}
            >
              <DeleteIcon width={24} height={24} />
            </CustomButton>
          </div>
        )}

      </div>

      {showNotesEditor ? (
        <div className={styles.notesContainer}>
          <CustomTextArea
            name={`notes-${song.uid}`}
            placeholder='Notas para esta canción (ej. tiempo, dinámica, compás)'
            value={song.notes ?? ''}
            onPointerDown={(event) => event.stopPropagation()}
            onChange={(event) => onNotesChange?.(song.uid, event.target.value)}
          />
        </div>
      ) : null}

      {!showNotesEditor && song.notes ? (
        <div className={styles.notesPreviewContainer}>
          <span className={styles.songNotesPreview}>{song.notes}</span>
        </div>
      ) : null}

    </div>
  );
}

export default SortableSongItem;
