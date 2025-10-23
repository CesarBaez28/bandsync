import styles from './calendar.module.css';
import { auth } from "@/auth";
import { handleAsync } from '@/app/lib/utils';
import { ApiResponse, Event, MusicalBand, Repertoire } from '@/app/lib/definitions';
import { getAllEventsByMusicalBandId } from '@/app/lib/api/events';
import { EventInput } from "@fullcalendar/core/index.js";
import Calendar from '@/app/ui/musicalbands/calendar/Calendar';
import { getAllRepertoiresByMusicalBandId } from '@/app/lib/api/repertoires';

type CalendarPageProps = {
  params: Promise<{ hypName: string; }>;
}

export default async function CalendarPage(props: CalendarPageProps) {
  const [session, { hypName }] = await Promise.all([
    auth(),
    props.params
  ]);

  const musicalBand: MusicalBand | undefined = session?.user?.musicalBands.find(mb => mb.hyphenatedName === hypName);

  const [[events, eventsError], [repertoires, repertoiresError]] = await Promise.all([
    handleAsync<ApiResponse<Event[]>>(getAllEventsByMusicalBandId({ musicalBandId: musicalBand?.id })),
    handleAsync<ApiResponse<Repertoire[]>>(getAllRepertoiresByMusicalBandId({ musicalBandId: musicalBand?.id }))
  ]);

  const fullcalendarEvents: EventInput[] = events?.data?.map(ev => ({
    id: ev.id,
    title: ev.name,
    start: ev.date ? new Date(ev.date) : undefined,
    extendedProps: {
      description: ev.description,
      place: ev.place,
      location: ev.location,
      repertoire: ev.repertoire
    },
    allDay: true
  })) || [];

  return (
    <div>
      <h2>Calendario</h2>

      <main className={styles.mainContainer}>
        {eventsError || repertoiresError
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : <Calendar events={events?.data} fullcalendarEvents={fullcalendarEvents} repertoires={repertoires?.data} musicalBand={musicalBand} />
        }
      </main>
    </div>
  );
}