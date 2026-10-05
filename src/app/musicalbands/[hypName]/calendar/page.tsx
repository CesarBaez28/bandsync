import styles from './calendar.module.css';
import { formatDateOnly, handleAsync } from '@/app/lib/utils';
import { ApiResponse, Event } from '@/app/lib/definitions';
import { getAllEventsByMusicalBandId } from '@/app/lib/api/events';
import { EventInput } from "@fullcalendar/core/index.js";
import Calendar from '@/app/ui/musicalbands/calendar/Calendar';
import { getMusicalBandByHyphenatedName } from '@/app/lib/api/musicalBands';
import { Metadata } from 'next';

type CalendarPageProps = {
  params: Promise<{ hypName: string; }>;
}

export const metadata: Metadata = {
  title: "Calendario",
  description: "Calendario",
};

export default async function CalendarPage(props: CalendarPageProps) {
  const { hypName } = await props.params;

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  const [events, eventsError] = await handleAsync<ApiResponse<Event[]>>(
    getAllEventsByMusicalBandId({ musicalBandId: musicalBand?.id })
  );

  const fullcalendarEvents: EventInput[] = events?.data?.map(ev => ({
    id: ev.id,
    title: ev.name,
    start: ev.date ? formatDateOnly(ev.date) : undefined,
    extendedProps: {
      description: ev.description,
      place: ev.place,
      location: ev.location
    },
    allDay: true
  })) || [];

  return (
    <div>
      <h2>Calendario</h2>

      <main className={styles.mainContainer}>
        {eventsError
          ? <div className="message">
            <h2>¡Lo sentimos!</h2>
            <p>Hubo un error al traer los datos. Intente refrescar la página o vuelva a visitar la página más tarde.</p>
          </div>
          : <Calendar events={events?.data} fullcalendarEvents={fullcalendarEvents} musicalBand={musicalBand} />
        }
      </main>
    </div>
  );
}