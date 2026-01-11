'use client';

import stylesForm from '../../../styles/form.module.css';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { startTransition, useActionState, useEffect, useRef, useState, useCallback } from "react";
import CustomButton from "../../button/CustomButton";
import Image from "next/image";
import { Event, MusicalBand, Repertoire } from "@/app/lib/definitions";
import { EventInput } from "@fullcalendar/core/index.js";
import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import Modal from "../../modal/Modal";
import CustomSelect, { OptionInputSelect } from '../../Inputs/CustomSelect';
import CustomInput from '../../Inputs/CustomInput';
import CustomTextArea from '../../Inputs/CustomTextArea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventSchema, eventSchema } from '@/app/lib/schemas/eventSchema';
import { formatDate } from '@/app/lib/utils';
import { createEventAction, deleteEventAction, DeleteEventProps, EventState, updateEventAction } from '@/app/lib/actions/events';
import { useToast } from '../../toast/ToastContext';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import { usePermissions } from '@/app/lib/customHooks';

type Props = {
  readonly events: Event[] | undefined;
  readonly fullcalendarEvents: EventInput[];
  readonly repertoires: Repertoire[] | undefined;
  readonly musicalBand: MusicalBand | undefined;
};

type Permisions = {
  canAddEvent: boolean;
  canUpdateEvent: boolean;
  canDeleteEvent: boolean;
}

export default function Calendar({ events, fullcalendarEvents, repertoires, musicalBand }: Props) {
  const { hasPermission } = usePermissions();
  const [permissions, setPermissions] = useState<Permisions>({
    canAddEvent: false,
    canUpdateEvent: false,
    canDeleteEvent: false
  });
  const [fullcalendarEventsState, setFullcalendarEventsState] = useState<EventInput[] | undefined>(fullcalendarEvents);
  const [eventsState, setEventsState] = useState<Event[] | undefined>(events);
  const { showToast } = useToast();
  const formRefCreate = useRef<HTMLFormElement>(null);
  const initialCreateState: EventState = { errors: {}, message: null, success: false, newEvent: undefined };
  const [createState, formCreateAction, isCreateLoading] = useActionState<EventState, FormData>(createEventAction, initialCreateState);
  const formRefEdit = useRef<HTMLFormElement>(null);
  const initialEditState: EventState = { errors: {}, message: null, success: false };
  const [editState, formEditAction, isEditLoading] = useActionState<EventState, FormData>(updateEventAction, initialEditState);
  const initialDeleteState: EventState = { message: null, success: false };
  const [deleteState, formDeleteAction, isDeleteLoading] = useActionState<EventState, DeleteEventProps>(deleteEventAction, initialDeleteState);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  useEffect(() => {
    const canAddEvent = hasPermission(UserPermissions.ADD_EVENT, musicalBand?.id);
    const canUpdateEvent = hasPermission(UserPermissions.UPDATE_EVENT, musicalBand?.id);
    const canDeleteEvent = hasPermission(UserPermissions.DELETE_EVENT, musicalBand?.id);
    setPermissions({
      canAddEvent,
      canUpdateEvent,
      canDeleteEvent
    });
  }, [hasPermission, musicalBand]);

  const repertoiresOptions: OptionInputSelect[] | undefined = repertoires
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((repertoire) => (
      { label: repertoire.name, value: repertoire.id.toString() }
    ));

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    setValue: setValueCreate,
    formState: { errors: errorsCreate },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
  });

  const handleDateClick = (arg: DateClickArg) => {
    if (!permissions.canAddEvent) return;
    setValueCreate('date', arg.dateStr);
    setOpenCreateModal(true);
  }

  const handleCreateEvent = () => {
    setOpenCreateModal(true);
    const formattedDate = formatDate(new Date());
    setValueCreate('date', formattedDate);
  }

  const handleCreateCancel = useCallback(() => {
    setOpenCreateModal(false);
    setValueCreate('date', '');
    resetCreate();
  }, [setOpenCreateModal, setValueCreate, resetCreate]);

  const onSubmitCreate = () => {
    if (!formRefCreate.current) return;

    const fd = new FormData(formRefCreate.current);

    startTransition(() => {
      formCreateAction(fd);
    });
  };

  useEffect(() => {
    if (!createState?.success || !createState.newEvent) return;

    const newEvent = createState.newEvent;

    setEventsState(prev => prev ? [...prev, newEvent] : [newEvent]);

    const repertoire = repertoires?.find(r => r.id === newEvent.repertoire.id);

    const newFullcalendarEvent: EventInput = {
      id: newEvent.id,
      title: newEvent.name,
      start: newEvent.date ? new Date(newEvent.date) : undefined,
      extendedProps: {
        description: newEvent.description,
        place: newEvent.place,
        location: newEvent.location,
        repertoire
      },
      allDay: true
    };

    setFullcalendarEventsState(prev => prev ? [...prev, newFullcalendarEvent] : [newFullcalendarEvent]);

    handleCreateCancel();
    showToast("Evento creado exitosamente.", "success");

  }, [createState, handleCreateCancel, showToast, repertoires]);


  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    getValues: getValuesEdit,
    formState: { errors: errorsEdit },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
  });

  const onSubmitEdit = () => {
    if (!formRefEdit.current) return;

    const fd = new FormData(formRefEdit.current);

    startTransition(() => {
      formEditAction(fd);
    });
  };

  useEffect(() => {
    if (!editState?.success) return;

    const formValues = getValuesEdit();

    const updatedRepertoire = repertoires?.find(
      (r) => r.id.toString() === String(formValues.repertoire)
    );

    setEventsState((prev) =>
      prev?.map((ev) => {
        if (ev.id !== selectedEventId) return ev;

        return {
          ...ev,
          repertoire: updatedRepertoire || ev.repertoire,
          name: formValues.name,
          date: new Date(formValues.date + "T00:00:00"),
          description: formValues.description ? String(formValues.description) : ev.description,
          place: formValues.place,
          location: formValues.location,
        };
      })
    );

    setFullcalendarEventsState((prev) =>
      prev?.map((ev) => {
        if (ev.id !== selectedEventId) return ev;

        return {
          ...ev,
          title: formValues.name,
          start: new Date(formValues.date + "T00:00:00"),
          extendedProps: {
            description: formValues.description,
            place: formValues.place,
            location: formValues.location,
            repertoire: updatedRepertoire,
          },
        };
      })
    );

    setOpenEditModal(false);
    resetEdit();
    showToast("Evento actualizado exitosamente.", "success");
  }, [editState?.success, getValuesEdit, repertoires, resetEdit, selectedEventId, showToast]);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleEventClick = (arg: EventClickArg) => {
    setOpenEditModal(true);
    const selectedEvent = eventsState?.find(e => e.id === arg.event.id);
    setSelectedEventId(arg.event.id);
    if (selectedEvent) {
      setValueEdit('repertoire', selectedEvent.repertoire.id.toString());
      setValueEdit('name', selectedEvent.name);
      const formattedDate = formatDate(new Date(selectedEvent.date));
      setValueEdit('date', formattedDate);
      setValueEdit('description', selectedEvent.description);
      setValueEdit('place', selectedEvent.place || '');
      setValueEdit('location', selectedEvent.location || '');
    }
  }

  const handleEditCancel = () => {
    setOpenEditModal(false);
    resetEdit();
  }

  const onSubmitDelete = () => {
    startTransition(() => {
      if (!selectedEventId || !musicalBand?.id) return;

      const deleteData = {
        id: selectedEventId,
        musicalBandId: musicalBand.id
      };

      formDeleteAction(deleteData);
    });
  }

  useEffect(() => {
    if (!deleteState?.success) return;

    setEventsState(prev => prev?.filter(ev => ev.id !== selectedEventId));

    setFullcalendarEventsState(prev => prev?.filter(ev => ev.id !== selectedEventId));

    setOpenEditModal(false);
    resetEdit();
    showToast("Evento eliminado exitosamente.", "success");
  }, [deleteState?.success, resetEdit, selectedEventId, showToast]);


  return (
    <section id="modal-root">
      <div style={{ marginBottom: '1rem' }}>
        <Can permission={UserPermissions.ADD_EVENT} musicalBandId={musicalBand?.id}>
          <CustomButton iconLeft={<Image src={'/calendar_add_on_24dp.svg'} width={24} height={24} alt="Añadir" />} type="button" onClick={() => handleCreateEvent()}>
            Agregar evento
          </CustomButton>
        </Can>
      </div>
      <div style={{ height: '80vh', width: '100%', overflowX: 'auto' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={isMobile ? "timeGridDay" : "dayGridMonth"}
          events={fullcalendarEventsState}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: isMobile ? "" : "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          titleFormat={{
            year: "numeric",
            month: isMobile ? "short" : "long"
          }}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          locale={'es'}
          selectable={true}
          editable={false}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="100%"
          expandRows={true}
          eventContent={renderEventContent}
        />
      </div>

      <Modal
        size={isMobile ? "sm" : "md"}
        isOpen={openCreateModal}
        title="Agregar Evento"
      >
        <form
          ref={formRefCreate}
          action={formCreateAction}
          onSubmit={handleSubmitCreate(onSubmitCreate)}
        >
          <div className={stylesForm.fieldsContainer}>

            <CustomSelect
              label="Selecione el repertorio:"
              options={repertoiresOptions}
              {...registerCreate("repertoire")}
              error={errorsCreate.repertoire}
            />

            <CustomInput
              label="Nombre del evento:"
              type="text"
              {...registerCreate("name")}
              error={errorsCreate.name}
            />

            <CustomInput
              label="Fecha del evento:"
              type="date"
              {...registerCreate("date")}
              error={errorsCreate.date}
            />

            <CustomTextArea
              label="Descripción:"
              {...registerCreate("description")}
              error={errorsCreate.description}
            />

            <CustomInput
              label="Lugar:"
              type="text"
              {...registerCreate("place")}
              error={errorsCreate.place}
            />

            <CustomInput
              label="Ubicación (Google Maps):"
              type="text"
              {...registerCreate("location")}
              error={errorsCreate.location}
            />

            <input type="hidden" name="musicalBandId" value={musicalBand?.id} />

            {createState?.message && (
              <p className={stylesForm.errorMessage}>
                {createState?.message}
              </p>
            )}

            <div className={stylesForm.buttonsContainer}>
              <CustomButton type='button' variant='secondary' onClick={handleCreateCancel}>
                Cancelar
              </CustomButton>
              <CustomButton isLoading={isCreateLoading} type='submit'>
                Guardar
              </CustomButton>
            </div>

          </div>
        </form>
      </Modal>

      <Modal
        size={isMobile ? "sm" : "md"}
        isOpen={openEditModal}
        title="Información del Evento"
      >
        <form
          ref={formRefEdit}
          action={formEditAction}
          onSubmit={handleSubmitEdit(onSubmitEdit)}
        >
          <div className={stylesForm.fieldsContainer}>

            <CustomSelect
              disabled={!permissions.canUpdateEvent}
              label="Selecione el repertorio:"
              options={repertoiresOptions}
              {...registerEdit("repertoire")}
              error={errorsEdit.repertoire}
            />

            <CustomInput
              disabled={!permissions.canUpdateEvent}
              label="Nombre del evento:"
              type="text"
              {...registerEdit("name")}
              error={errorsEdit.name}
            />

            <CustomInput
              disabled={!permissions.canUpdateEvent}
              label="Fecha del evento:"
              type="date"
              {...registerEdit("date")}
              error={errorsEdit.date}
            />

            <CustomTextArea
              disabled={!permissions.canUpdateEvent}
              label="Descripción:"
              {...registerEdit("description")}
              error={errorsEdit.description}
            />

            <CustomInput
              disabled={!permissions.canUpdateEvent}
              label="Lugar:"
              type="text"
              {...registerEdit("place")}
              error={errorsEdit.place}
            />

            <CustomInput
              disabled={!permissions.canUpdateEvent}
              label="Ubicación (Google Maps):"
              type="text"
              {...registerEdit("location")}
              error={errorsEdit.location}
            />

            <input type="hidden" name="musicalBandId" value={musicalBand?.id} />
            <input type="hidden" name="eventId" value={selectedEventId} />

            {editState?.message && (
              <p className={stylesForm.errorMessage}>
                {editState?.message}
              </p>
            )}

            <div className={stylesForm.buttonsContainer}>
              <CustomButton type='button' variant='secondary' onClick={handleEditCancel}>
                Cerrar
              </CustomButton>
              <Can permission={UserPermissions.DELETE_EVENT} musicalBandId={musicalBand?.id}>
                <CustomButton
                  isLoading={isDeleteLoading}
                  style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-white)' }}
                  type='button'
                  variant='secondary'
                  onClick={onSubmitDelete}
                >
                  Eliminar
                </CustomButton>
              </Can>
              <Can permission={UserPermissions.UPDATE_EVENT} musicalBandId={musicalBand?.id}>
                <CustomButton isLoading={isEditLoading} type='submit'>
                  Guardar
                </CustomButton>
              </Can>
            </div>

          </div>
        </form>
      </Modal>

    </section>
  );
}

function renderEventContent(arg: EventContentArg) {
  const event = arg.event.extendedProps;

  return (
    <div
      className="p-1 rounded-md text-xs"
      style={{
        backgroundColor: arg.backgroundColor,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <strong>{arg.event.title}</strong>
      {event.place && <div>{event.place}</div>}
      <div>{event.repertoire.name}</div>
    </div>
  )
} 
