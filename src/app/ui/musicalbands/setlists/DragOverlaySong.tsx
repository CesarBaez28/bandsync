import styles from '@/ui/musicalbands/setlists/setlists-content.module.css';
import { SongItem } from './useSetListForm';

type Props = {
  readonly activeSelectedSong: SongItem | null | undefined
  readonly activeSelectedSongIndex: number
}

export function DragOverlaySong({ activeSelectedSong, activeSelectedSongIndex }: Props) {
  if (!activeSelectedSong) return null

  return (
    <div className={`${styles.selectedSongItem} ${styles.songDragOverlay}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.songOrderBadge}>{activeSelectedSongIndex + 1}</span>
          <div className={styles.songDetails}>
            <span className={styles.songName}>{activeSelectedSong.name}</span>
            <span className={styles.songSubtext}>{activeSelectedSong.artist.name}</span>
          </div>
        </div>
      </div>
      {activeSelectedSong.notes ? (
        <div className={styles.notesPreviewContainer}>
          <span className={styles.songNotesPreview}>{activeSelectedSong.notes}</span>
        </div>
      ) : null}
    </div>
  )
}