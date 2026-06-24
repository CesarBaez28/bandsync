'use client';

import { MusicalBandDeletionCheck } from "@/app/lib/definitions";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Card from "../card/Card";
import { StepBlock } from "../steps/StepBlock";
import styles from '@/ui/delete-account/delete-account-content.module.css';
import CustomImage from "../image/CustomImage";
import ImageIcon from '@/public/image_100dp.svg';
import CustomButton from "@/ui/button/CustomButton";
import CustomSelect from "../inputs/CustomSelect";
import { buildTransferSchema, TransferFormData } from "@/app/lib/schemas/buildTransferSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { transferAndDeleteAccountAction, TransferAndDeleteAccountState } from "@/app/lib/actions/users";
import { UUID } from "node:crypto";
import { useRouter } from "next/navigation";
import { useToast } from "../toast/ToastContext";
import { signOutAction } from "@/app/lib/actions/auth";

type Props = {
  readonly musicalBands: MusicalBandDeletionCheck[] | undefined;
}

type Step = 1 | 2 | 3;

export type TransferSelection = {
  musicalBandId: UUID;
  adminId: number;
  userId: UUID;
}

const STEP_1 = 1;
const STEP_2 = 2;
const STEP_3 = 3;

export default function DeleteAccountContent({ musicalBands }: Props) {

  const router = useRouter();
  const { showToast } = useToast();
  const formRefStep2 = useRef<HTMLFormElement>(null);
  const formRefStep3 = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<Step>(STEP_1);
  const [transferSelections, setTransferSelections] = useState<TransferSelection[]>([]);
  const initialState: TransferAndDeleteAccountState = { message: null, success: false };
  const [state, formAction, isPending] = useActionState<TransferAndDeleteAccountState, FormData>(transferAndDeleteAccountAction, initialState);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, STEP_3) as Step);

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, STEP_1) as Step);
  };

  const bandIds =
    musicalBands?.map(
      (band) => band.musicalBand.id
    ) ?? [];

  const schema = buildTransferSchema(bandIds);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TransferFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmitStep2 = () => {
    if (!formRefStep2.current) return;

    const fd = new FormData(formRefStep2.current);
    const transfers: TransferSelection[] = [];

    fd.forEach((value) => {
      if (typeof value !== 'string') return;

      const [userId, bandId] = value.split('|');
      const adminId = musicalBands?.find((band) => band.musicalBand.id === bandId)?.adminId;

      if (adminId) {
        transfers.push({
          musicalBandId: bandId as UUID,
          adminId,
          userId: userId as UUID,
        });
      }
    });

    setTransferSelections(transfers);
    setStep(STEP_3);
  }

  const onSubmitStep3 = () => {
    if (!formRefStep3.current) return;

    const fd = new FormData(formRefStep3.current);

    transferSelections.forEach((transfer, index) => {
      fd.append(`transfers[${index}]`, JSON.stringify({
        musicalBandId: transfer.musicalBandId,
        adminId: transfer.adminId,
        userId: transfer.userId,
      }));
    });

    startTransition(() => {
      formAction(fd);
    });
  };

  useEffect(() => {
    if (state?.success) {
      signOutAction();
      showToast('Cuenta eliminada exitosamente', 'success');
    }

    if (state?.message) {
      showToast(state.message, 'error', 6000);
    }

  }, [state, router, showToast]);

  return (
    <Card>
      <div className={styles.mainContent}>

        <StepBlock
          current={step}
          step={STEP_1}
          label="Revisión previa"
          showLine={true}
        >
          <div className={styles.columnLayout}>

            <div className={styles.warningMessage}>
              <h3>⚠️ Antes de eliminar tu cuenta, hay algunas cosas que debes hacer</h3>
              <p>
                Eres administrador de las siguientes bandas. Antes de eliminar tu cuenta, debes asignar un nuevo administrador para cada una de ellas
              </p>
            </div>

            <div className={styles.bandsList}>
              <h3>Bandas que administras ({musicalBands?.length || 0})</h3>
              <div className={styles.bandItemsContainer}>
                {musicalBands && musicalBands.length > 0 ? (
                  musicalBands.map((bandCheck) => (
                    <div key={bandCheck.musicalBand.id} className={styles.bandItem}>
                      <span className={styles.bandInfoContainer}>
                        <CustomImage
                          src={bandCheck.musicalBand.logo}
                          alt={'Foto de perfil'}
                          width={60}
                          height={60}
                          fallback={<ImageIcon width={60} height={60} />}
                          className={bandCheck.musicalBand.logo ? styles['image'] : styles['fall-back']}
                        />
                        <div className={styles.bandInfo}>
                          <h4>
                            {bandCheck.musicalBand.name}
                          </h4>
                          <span className={styles.membersCount}>
                            {bandCheck.members.length} {bandCheck.members.length === 1 ? 'miembro' : 'miembros'}
                          </span>
                        </div>
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No administras ninguna banda actualmente.</p>
                )}
              </div>
            </div>

            <div>
              <CustomButton onClick={nextStep}>
                Continuar
              </CustomButton>
            </div>

          </div>
        </StepBlock>

        <StepBlock
          current={step}
          step={STEP_2}
          label="Transferencia de administración"
          showLine={true}
        >
          <form
            ref={formRefStep2}
            className={styles.columnLayout}
            onSubmit={handleSubmit(onSubmitStep2)}
          >

            <div>
              <h3>Transfiere la administración de tus bandas</h3>
              <p>
                Selecciona un nuevo administrador para cada banda que administras.
              </p>
            </div>

            <div className={styles.bandsList}>
              <div className={styles.bandItemsContainer}>
                {musicalBands && musicalBands.length > 0 ? (
                  musicalBands.map((bandCheck) => (
                    <div key={bandCheck.musicalBand.id} className={`${styles.bandItem} ${styles.columnLayout}`}>
                      <span className={styles.bandInfoContainer}>
                        <CustomImage
                          src={bandCheck.musicalBand.logo}
                          alt={'Logo de la banda'}
                          width={60}
                          height={60}
                          fallback={<ImageIcon width={60} height={60} />}
                          className={bandCheck.musicalBand.logo ? styles['image'] : styles['fall-back']}
                        />
                        <div className={styles.bandInfo}>
                          <h4>
                            {bandCheck.musicalBand.name}
                          </h4>
                          <span className={styles.membersCount}>
                            {bandCheck.members.length} {bandCheck.members.length === 1 ? 'miembro' : 'miembros'}
                          </span>
                        </div>
                      </span>

                      <div className={styles.selectContainer}>
                        <CustomSelect
                          label="Elija el nuevo administrador:"
                          options={bandCheck.members.map((member) => ({
                            label: member.username,
                            value: `${member.id}|${bandCheck.musicalBand.id}`,
                          }))}
                          {...register(
                            `transfers.${bandCheck.musicalBand.id}`
                          )}
                          error={
                            errors.transfers?.[
                            String(bandCheck.musicalBand.id)
                            ]
                          }
                        />

                      </div>
                    </div>
                  ))
                ) : (
                  <p>No administras ninguna banda actualmente.</p>
                )}
              </div>

            </div>

            <div className={styles.actionsRow}>
              <CustomButton type="button" variant="secondary" onClick={prevStep} >
                Volver
              </CustomButton>
              <CustomButton type="submit" isLoading={isPending}>
                Continuar
              </CustomButton>
            </div>

          </form>
        </StepBlock>

        <StepBlock
          current={step}
          step={STEP_3}
          label="Confirmación"
          showLine={true}
        >
          <form
            ref={formRefStep3}
            action={formAction}
            className={styles.columnLayout}
            onSubmit={handleSubmit(onSubmitStep3)}
          >

            <div>
              <h3>Revisa y confirma</h3>
              <p>
                Estás a punto de eliminar tu cuenta. Revisa que todo esté correcto.
              </p>
            </div>

            <div className={styles.transferSummary}>
              <div className={styles.transferSummaryContainer}>
                {transferSelections.map((transfer) => {
                  const band = musicalBands?.find((b) => b.musicalBand.id === transfer.musicalBandId)?.musicalBand;
                  const newAdmin = musicalBands?.find((b) => b.musicalBand.id === transfer.musicalBandId)?.members.find((m) => m.id === transfer.userId);
                  const membersCount = musicalBands?.find((b) => b.musicalBand.id === transfer.musicalBandId)?.members.length;

                  if (!band || !newAdmin) return null;

                  return (
                    <div key={transfer.musicalBandId} className={styles.transferSummaryItem}>
                      <div className={styles.leftColumn}>
                        <span className={styles.bandInfoContainer}>
                          <CustomImage
                            src={band.logo}
                            alt={'Logo de la banda'}
                            width={40}
                            height={40}
                            fallback={<ImageIcon width={40} height={40} />}
                            className={band.logo ? styles['image'] : styles['fall-back']}
                          />
                          <div className={styles.transferInfo}>
                            <h4>{band.name}</h4>
                            <p className={styles.smallText}>{membersCount ?? 0} miembros</p>
                          </div>
                        </span>
                      </div>

                      <div className={styles.arrowContainer} aria-hidden>
                        <h4 className={styles.arrow}>→</h4>
                      </div>

                      <div className={styles.rightColumn}>
                        <span className={styles.bandInfoContainer}>
                          <CustomImage
                            src={newAdmin.photo}
                            alt={'Foto del nuevo administrador'}
                            width={40}
                            height={40}
                            fallback={<ImageIcon width={40} height={40} />}
                            className={newAdmin.photo ? styles['image'] : styles['fall-back']}
                          />
                          <div className={styles.transferInfo}>
                            <h4>{newAdmin.username}</h4>
                            <p className={styles.smallText}>Nuevo administrador</p>
                          </div>
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.actionsRow}>
              <CustomButton type="button" variant="secondary" onClick={prevStep} >
                Volver
              </CustomButton>
              <CustomButton type="submit" isLoading={isPending}>
                Eliminar cuenta
              </CustomButton>
            </div>

          </form>

        </StepBlock>

      </div>
    </Card>
  )
}