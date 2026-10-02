'use client';

import stylesForm from '@/app/styles/form.module.css';
import { MusicalBand, Setlist, SetlistDetails } from "@/app/lib/definitions";
import CustomButton from "../../button/CustomButton";
import CustomSelect, { OptionInputSelect } from "../../inputs/CustomSelect";
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { exportSetListSchema, ExportSetListSchema } from '@/app/lib/schemas/exportSetListSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { exportSetListAction, ExportSetListState } from '@/app/lib/actions/setlists';
import { pdf } from '@react-pdf/renderer';
import { SetListDocument } from './pdf/documents/SetListDocument';
import { downloadSetListSpreadsheet } from '@/app/lib/api/setlists';
import { handleAsync } from '@/app/lib/utils';

type Props = {
  readonly setlists: Setlist[] | undefined;
  readonly imageBase64: string | null;
  readonly musicalBand: MusicalBand | undefined;
}

export const exportOptions: OptionInputSelect[] = [
  { label: "Pdf", value: "1" },
  { label: "Excel", value: "2" }
];

export default function ExportSetListsContent({ setlists, imageBase64, musicalBand }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const initialState: ExportSetListState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<ExportSetListState, FormData>(exportSetListAction, initialState);

  const setlistsOptions: OptionInputSelect[] | undefined = setlists
    ?.toSorted((a, b) => a.name.localeCompare(b.name))
    .map((repertoire) => (
      { label: repertoire.name, value: repertoire.id.toString() }
    ));

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ExportSetListSchema>({
    resolver: zodResolver(exportSetListSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    startTransition(() => formAction(formData));
  };

  const printSetList = useCallback(async (setlistDetails: SetlistDetails) => {
    const blob = await pdf(
      <SetListDocument
        musicalBandName={musicalBand?.name}
        setlistDetails={setlistDetails}
        imageBase64={imageBase64}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const iframe = iframeRef.current;

    if (!iframe) {
      URL.revokeObjectURL(url);
      return;
    }

    iframe.onload = () => {
      const frameWindow = iframe.contentWindow;
      if (!frameWindow) return;

      frameWindow.addEventListener('afterprint', () => URL.revokeObjectURL(url), { once: true });
      frameWindow.focus();
      frameWindow.print();
    };
    
    iframe.src = url;
  }, [imageBase64, musicalBand?.name]);

  const downloadExcel = useCallback(async (setlistDetails: SetlistDetails) => {
    if (!musicalBand?.id) {
      throw new Error('No se encontró la banda seleccionada.');
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const [spreadsheet, error] = await handleAsync<Blob>(downloadSetListSpreadsheet({
        musicalBandId: musicalBand.id,
        setlistId: setlistDetails.setList.id,
      }));

      if (error || !spreadsheet) {
        throw error ?? new Error('No se pudo obtener el archivo Excel.');
      }

      const url = URL.createObjectURL(spreadsheet);
      const link = document.createElement('a');
      const filename = `${setlistDetails.setList.name.replace(/[\\/:*?"<>|]/g, '_')}.xlsx`;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setIsDownloading(false);
    }
  }, [musicalBand?.id]);

  useEffect(() => {

    const details = state.data?.setlistDetails;

    if (!state.success || !details) return;

    if (state.data?.option === '1') {
      void printSetList(details);
      return;
    }

    if (state.data?.option === '2') {
      void downloadExcel(details).catch((error: unknown) => {
        setDownloadError(error instanceof Error ? error.message : 'No se pudo descargar el archivo Excel.');
      });
    }

  }, [state, printSetList, downloadExcel]);

  return (
    <form
      action={formAction}
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
    >

      <div className={stylesForm.fieldsContainer + ' col-12 col-sm-8 col-md-6 col-lg-5'}>
        <CustomSelect
          label="Seleccione el set list:"
          options={setlistsOptions}
          {...register("setlist")}
          error={errors.setlist}
        />

        <CustomSelect
          label="Opciones de exportación:"
          options={exportOptions}
          {...register("option")}
          error={errors.option}
        />

        <input type="hidden" name="musicalBandId" value={musicalBand?.id ?? ''} />

        {state?.message && (
          <p className={stylesForm.errorMessage}>
            {state?.message}
          </p>
        )}

        {downloadError && (
          <p className={stylesForm.errorMessage}>
            {downloadError}
          </p>
        )}

        <div className={stylesForm.buttonsContainer}>
          <CustomButton isLoading={isPending || isDownloading} type='submit'>
            Exportar
          </CustomButton>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        style={{ display: "none", width: 0, height: 0 }}
        title="Imprimir set list"
      />
    </form>
  )
}