import stylesResponsive from '@/app/styles/responsive.module.css';
import { SetListSongs } from '@/app/lib/definitions';
import Accordion from '@/app/ui/accordion/Accordion';
import CustomLink from '@/app/ui/link/CustomLink';
import LinkIcon from '@/public/link_24dp.svg';
import DocsIcon from '@/public/docs_24dp.svg';
import styles from './see-setlist.module.css';
import setlistStyles from './setlists-content.module.css';

type Props = {
  readonly sets: SetListSongs[];
};

export default function SeeSetList({ sets }: Props) {
  const orderedSets = [...sets].sort((first, second) => first.set.orderIndex - second.set.orderIndex);

  if (orderedSets.length === 0) {
    return (
      <div className="message">
        <p>Este set list todavía no tiene sets.</p>
      </div>
    );
  }

  return (
    <div className={styles.setsList}>
      <h3>Sets</h3>
      {orderedSets.map(({ set, songs }, setIndex) => {
        const orderedSongs = [...songs].sort((first, second) => first.orderIndex - second.orderIndex);

        return (
          <Accordion
            key={set.id.toString()}
            header={(
              <div className={setlistStyles.setHeader}>
                <div className={setlistStyles.setHeaderTitle}>
                  <span className={setlistStyles.setTitle}>{set.orderIndex || setIndex + 1}. {set.name}</span>
                </div>
                <div className={setlistStyles.setHeaderMeta}>
                  <span className={setlistStyles.setMeta}>Canciones: {orderedSongs.length}</span>
                </div>
              </div>
            )}
          >
            {orderedSongs.length === 0 ? (
              <p className={styles.emptySet}>Este set todavía no tiene canciones.</p>
            ) : (
              <>
                <div className={stylesResponsive.desktopOnly}>
                  <div className={styles.tableWrapper}>
                    <table>
                      <thead>
                        <tr>
                          <th>Orden</th>
                          <th>Canción</th>
                          <th>Artista</th>
                          <th>Género</th>
                          <th>Tonalidad</th>
                          <th>Notas</th>
                          <th>Enlaces</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderedSongs.map(({ id, orderIndex, song, notes }) => (
                          <tr key={id.toString()}>
                            <td>{orderIndex}</td>
                            <td>{song.name}</td>
                            <td>{song.artist?.name}</td>
                            <td>{song.genre?.name}</td>
                            <td>{song.tonality}</td>
                            <td className={styles.notes}>{notes || '—'}</td>
                            <td>
                              <SongLinks songLink={song.link} sheetMusic={song.sheetMusic} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className={stylesResponsive.mobileOnly}>
                  <div className={styles.songAccordionList}>
                    {orderedSongs.map(({ id, orderIndex, song, notes }) => (
                      <Accordion
                        className={styles.songAccordion}
                        key={id.toString()}
                        header={(
                          <div className={styles.songHeader}>
                            <span className={styles.songOrder}>{orderIndex}</span>
                            <p>{song.name}</p>
                          </div>
                        )}
                        actions={<SongLinks songLink={song.link} sheetMusic={song.sheetMusic} />}
                      >
                        <dl className={styles.songDetails}>
                          <div><dt>Artista</dt><dd>{song.artist?.name || '—'}</dd></div>
                          <div><dt>Género</dt><dd>{song.genre?.name || '—'}</dd></div>
                          <div><dt>Tonalidad</dt><dd>{song.tonality || '—'}</dd></div>
                          <div><dt>Notas</dt><dd className={styles.notes}>{notes || '—'}</dd></div>
                        </dl>
                      </Accordion>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Accordion>
        );
      })}
    </div>
  );
}

function SongLinks({ songLink, sheetMusic }: { readonly songLink?: string; readonly sheetMusic?: string }) {
  return (
    <div className={styles.songLinks}>
      {songLink && (
        <CustomLink href={songLink} variant="tertiary" newTab aria-label="Abrir canción">
          <LinkIcon width={24} height={24} />
        </CustomLink>
      )}
      {sheetMusic && (
        <CustomLink href={sheetMusic} variant="tertiary" newTab aria-label="Abrir archivo de la canción">
          <DocsIcon width={24} height={24} />
        </CustomLink>
      )}
      {!songLink && !sheetMusic && <span>—</span>}
    </div>
  );
}