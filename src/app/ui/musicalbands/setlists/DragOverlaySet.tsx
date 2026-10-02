import styles from '@/ui/musicalbands/setlists/setlists-content.module.css';
import { SetSongs } from './useSetListForm';

type Props = {
  readonly activeSet: SetSongs | null | undefined;
  readonly activeSetIndex: number;
}

export function DragOverlaySet({ activeSet, activeSetIndex }: Props) {

  if (!activeSet) return null;

  return (
    <div className={`${styles.dragOverlayCard}`}>
      <div className={styles.dragOverlayHeader}>
        <span className={styles.setIndex}>{activeSetIndex + 1}.</span>
        <div>
          <div className={styles.dragOverlayTitle}>{activeSet.name}</div>
          <div className={styles.dragOverlaySubtitle}>{activeSet.songs.length} canciones</div>
        </div>
      </div>
      {activeSet.songs.length > 0 ? (
        <div className={styles.dragOverlaySongs}>
          {activeSet.songs.slice(0, 3).map((song) => (
            <div key={song.uid} className={styles.songOverlayRow}>
              <span className={styles.songName}>{song.name}</span>
              <span className={styles.songSubtext}>{song.artist.name}</span>
            </div>
          ))}
          {activeSet.songs.length > 3 ? (
            <div className={styles.dragOverlayMore}>+{activeSet.songs.length - 3} más</div>
          ) : null}
        </div>
      ) : (
        <div className={styles.dragOverlayEmpty}>Sin canciones</div>
      )}
    </div>
  )
}