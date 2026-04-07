'use client';

import stylesForm from '@/app/styles/form.module.css';
import { startTransition, useActionState, useCallback, useEffect, useRef } from 'react';
import CustomSelect, { OptionInputSelect } from '../../Inputs/CustomSelect';
import { MusicalBand, Repertoire, Song } from '@/app/lib/definitions';
import { pdf } from '@react-pdf/renderer';
import CustomButton from '../../button/CustomButton';
import { optionsRepertoireDocument, RepertoireDocument, RepertoireOption } from './pdf/documents/RepertoireDocument';
import { useForm } from 'react-hook-form';
import { exportSchema, ExportSchema } from '@/app/lib/schemas/exportRepertoireSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { exportRepertoireAction, ExportRepertoireState } from '@/app/lib/actions/repertoires';

type Props = {
  readonly repertoires: Repertoire[] | undefined;
  readonly imageBase64: string | null;
  readonly musicalBand: MusicalBand | undefined;
}

export default function ExportRerpertoiresContent({ repertoires, imageBase64, musicalBand }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inisitalState: ExportRepertoireState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<ExportRepertoireState, FormData>(exportRepertoireAction, inisitalState);

  const repertoiresOptions: OptionInputSelect[] | undefined = repertoires
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((repertoire) => (
      { label: repertoire.name, value: repertoire.id.toString() }
    ));

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ExportSchema>({
    resolver: zodResolver(exportSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    startTransition(() => {
      formAction(fd);
    });
  };

  const handlePrint = useCallback(async (option: string, songs: Song[]) => {
    const repertoireName = repertoires?.find(repertoire => repertoire.id.toString() === state.data?.repertoire);

    const blob = await pdf(
      <RepertoireDocument
        musicalBandName={musicalBand?.name}
        repertoireName={repertoireName?.name}
        option={option as RepertoireOption}
        songs={songs}
        imageBase64={imageBase64}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    if (iframeRef.current) {
      iframeRef.current.src = url;
      iframeRef.current.onload = () => {
        iframeRef.current?.contentWindow?.focus();
        iframeRef.current?.contentWindow?.print();
      };
    }
  }, [imageBase64, repertoires, state, musicalBand]);

  useEffect(() => {
    if (state?.success && state.data?.songs && state.data?.option) {
      handlePrint(state.data.option, state.data.songs);
      state.success = false;
    }
  }, [state, handlePrint])

  return (
    <form
      action={formAction}
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
    >

      <div className={stylesForm.fieldsContainer + ' col-12 col-sm-8 col-md-6 col-lg-5'}>
        <CustomSelect
          label="Selecione el repertorio:"
          options={repertoiresOptions}
          {...register("repertoire")}
          error={errors.repertoire}
        />

        <CustomSelect
          label="Opciones de exportación:"
          options={optionsRepertoireDocument}
          {...register("option")}
          error={errors.option}
        />

        <input type="hidden" name="musicalBandId" value={musicalBand?.id} />

        {state?.message && (
          <p className={stylesForm.errorMessage}>
            {state?.message}
          </p>
        )}

        <div className={stylesForm.buttonsContainer}>
          <CustomButton isLoading={isPending} type='submit'>
            Exportar
          </CustomButton>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        style={{ display: "none", width: 0, height: 0 }}
        title="Print PDF"
      />
    </form>
  )
}