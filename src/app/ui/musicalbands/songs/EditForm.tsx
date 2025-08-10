'use client';

import stylesForm from '../../../styles/form.module.css'
import { Artist, MusicalGenre, Song } from "@/app/lib/definitions";
import { UUID } from "crypto";
import { useToast } from "../../toast/ToastContext";
import { startTransition, useActionState, useEffect, useRef } from "react";
import CustomSelect, { OptionInputSelect } from "../../Inputs/CustomSelect";
import CustomInput from "../../Inputs/CustomInput";
import CustomLink from "../../link/CustomLink";
import CustomButton from "../../button/CustomButton";
import CustomFileInput from "../../Inputs/CustomFileInput";
import { songSchema, SongSchema } from '@/app/lib/schemas/songSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UpdateSongState, updateSongAction } from '@/app/lib/actions/songs';
import { useRouter } from 'next/navigation';

type FormProps = {
  readonly song: Song | undefined
  readonly musicalBandId: UUID | undefined;
  readonly artists: Artist[] | undefined;
  readonly genres: MusicalGenre[] | undefined;
  readonly hypName: string;
}

export default function Form({ song, musicalBandId, artists, genres, hypName }: FormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialState: UpdateSongState = { errors: {}, message: null, success: false, song };
  const [state, formAction, isPending] = useActionState<UpdateSongState, FormData>(updateSongAction, initialState);

  const artistsOptions: OptionInputSelect[] | undefined = artists
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((artist) => (
      { label: artist.name, value: artist.id.toString() }
    ));

  const genresOption: OptionInputSelect[] | undefined = genres
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((genre) => (
      { label: genre.name, value: genre.id.toString() }
    ))

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SongSchema>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      name: song?.name,
      artist: song?.artist.id.toString(),
      genre: song?.genre.id.toString(),
      tonality: song?.tonality,
      link: song?.link
    },
    mode: "onChange",
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
      showToast('Canción actualizada con éxito!', 'success');
      router.push(`/musicalbands/${hypName}/songs`);
    }
  }, [state, hypName, router, showToast])

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={stylesForm.fieldsContainer}>
        <CustomInput
          label='Nombre:'
          type='text'
          {...register("name")}
          error={errors.name}
        />

        <CustomSelect
          label="Artista:"
          options={artistsOptions}
          {...register("artist")}
          error={errors.artist}
        />

        <CustomSelect
          label="Género:"
          options={genresOption}
          {...register("genre")}
          error={errors.genre}
        />

        <CustomInput
          label='Tonalidad:'
          type='text'
          {...register("tonality")}
          error={errors.tonality}
        />

        <CustomInput
          label='Link:'
          type='text'
          {...register("link")}
          error={errors.link}
        />

        <CustomFileInput
          ref={fileInputRef}
          name="image"
          label="Arhivo o partitura:"
          accept="image/*, .pdf"
          helperText="JPG, PNG o PDF (max. 5MB)"
          buttonText="Seleccionar archivo"
        />

        <input type="hidden" name="musicalBandId" value={musicalBandId} />
        <input type="hidden" name="id" value={song?.id} />

        {state?.message && (
          <p className={stylesForm.errorMessage}>
            {state?.message}
          </p>
        )}

        <div className={stylesForm.buttonsContainer}>
          <CustomLink buttonStyle={true} href={`/musicalbands/${hypName}/songs`} variant='secondary'>
            Cancelar
          </CustomLink>
          <CustomButton isLoading={isPending} type='submit'>
            Guardar
          </CustomButton>
        </div>

      </div>
    </form>
  );
}