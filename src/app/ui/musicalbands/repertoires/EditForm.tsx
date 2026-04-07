'use client';

import stylesForm from "../../../styles/form.module.css"
import { Repertoire, Song } from "@/app/lib/definitions";
import { UUID } from "crypto";
import { useToast } from "../../toast/ToastContext";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { RepertoireState, updateRepertoireAction } from "@/app/lib/actions/repertoires";
import CustomSelect, { OptionInputSelect } from "../../inputs-temporal/CustomSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { repertoireSchema, RepertoireSchema } from "@/app/lib/schemas/repertoireSchema";
import CustomButton from "../../button/CustomButton";
import Modal from "../../modal/Modal";
import RepertoireSongsTable from "./AddAndEditRepertoireSongsTable";
import CustomLink from "../../link-temporal/CustomLink";
import CustomInput from "../../inputs-temporal/CustomInput";
import CustomTextArea from "../../inputs-temporal/CustomTextArea";

type FormProps = {
  readonly repertoire: Repertoire | undefined;
  readonly repertoireSongs: Song[] | undefined;
  readonly songs: Song[] | undefined
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
}

export default function Form({ repertoire, repertoireSongs, songs, musicalBandId, hypName }: FormProps) {
  const [selected, setSelected] = useState<string>('');
  const [selectedSongs, setSelectedSongs] = useState<Song[]>(repertoireSongs || []);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: RepertoireState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<RepertoireState, FormData>(updateRepertoireAction, initialState);

  const songsOptions: OptionInputSelect[] | undefined = songs
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((song) => (
      { label: song.name, value: song.id.toString() }
    ));

  const handleAddSong = () => {
    const songToAdd = songs?.find(song => song.id.toString() === selected);
    if (songToAdd && !selectedSongs.find(song => song.id === songToAdd.id)) {
      setSelectedSongs([...selectedSongs, songToAdd]);
      setSelected('');
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RepertoireSchema>({
    resolver: zodResolver(repertoireSchema),
    mode: "onChange",
    defaultValues: {
      name: repertoire?.name,
      description: repertoire?.description,
      link: repertoire?.link
    }
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    startTransition(() => {
      formAction(fd);
    });
  };

  useEffect(() => {
    if (state?.success) {
      showToast('Repertorio actualizado con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/repertoires`);
    }
  }, [state, hypName, router, showToast])

  return (
    <div id="modal-root">
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

          <CustomTextArea
            label='Descripción:'
            {...register("description")}
            error={errors.description}
          />

          <CustomInput
            label='Link:'
            type='text'
            {...register("link")}
            error={errors.link}
          />

          <input type="hidden" name="musicalBandId" value={musicalBandId} />
          <input type="hidden" name="repertoireId" value={repertoire?.id} />
          <input type="hidden" name="songs" value={selectedSongs.map(song => song.id).toString()} />

          {state?.message && (
            <p className={stylesForm.errorMessage}>
              {state?.message}
            </p>
          )}
        </div>
        <div className={stylesForm.fieldsContainer} style={{ marginTop: '25px' }}>

          <div className={stylesForm.buttonsContainer}>
            <CustomLink buttonStyle={true} href={`/musicalbands/${hypName}/repertoires`} variant='secondary'>
              Cancelar
            </CustomLink>
            <CustomButton type="button" variant='secondary' onClick={() => setOpenModal(true)}>
              Agregar canción
            </CustomButton>
            <CustomButton isLoading={isPending} type='submit'>
              Guardar
            </CustomButton>
          </div>

          <RepertoireSongsTable songs={selectedSongs} setSongs={setSelectedSongs} />
        </div>
      </form>

      <Modal
        size="sm"
        isOpen={openModal}
        title="Agregar Canción"
      >
        <div className={stylesForm.fieldsContainer}>
          <CustomSelect
            name="songs"
            label="Canción:"
            options={songsOptions}
            onChange={(e) => setSelected(e.target.value)}
          />

          <div className={stylesForm.buttonsContainer}>
            <CustomButton type='button' variant='secondary' onClick={() => setOpenModal(false)}>
              Cancelar
            </CustomButton>
            <CustomButton type="button" onClick={handleAddSong}>
              Guardar
            </CustomButton>
          </div>

        </div>
      </Modal>

    </div>
  )
}