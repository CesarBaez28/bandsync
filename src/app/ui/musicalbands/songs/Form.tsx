'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import stylesForm from '../../../styles/form.module.css';
import CustomButton from "../../button/CustomButton";
import CustomInput from "../../Inputs/CustomInput";
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomLink from '../../link/CustomLink';
import { createSongSchema, CreateSongSchema } from '@/app/lib/schemas/createSongSchema';
import { createSongAction, CreateSongState } from '@/app/lib/actions/songs';
import CustomSelect, { OptionInputSelect } from '../../Inputs/CustomSelect';
import CustomFileInput from '../../Inputs/CustomFileInput';
import { Artist, MusicalGenre } from '@/app/lib/definitions';
import { useToast } from '../../toast/ToastContext';
import { useRouter } from 'next/navigation';

type FormProps = {
  readonly musicalBandId: UUID | undefined;
  readonly artists: Artist[] | undefined;
  readonly genres: MusicalGenre[] | undefined;
  readonly hypName: string;
}

export default function Form({ musicalBandId, artists, genres, hypName }: FormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialState: CreateSongState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<CreateSongState, FormData>(createSongAction, initialState);

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
    formState: { errors }
  } = useForm<CreateSongSchema>({
    resolver: zodResolver(createSongSchema),
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
      showToast('Canción registrada con éxito!', 'success');
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