'use client';

import styles from '@/ui/two-factor/Setup2FAView.module.css';
import stylesForm from '@/app/styles/form.module.css';
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { verify2FAAction, Verify2FAState } from "@/app/lib/actions/2fa";
import QRCode from "qrcode";
import CustomButton from "../button/CustomButton";
import Image from "next/image";
import CustomInput from "../inputs/CustomInput";
import Card from '@/app/ui/card/Card';
import { SetUp2FA } from '@/app/lib/api/users';
import { twoFactorSchema, TwoFactorSchema } from '@/app/lib/schemas/twoFactorSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type Props = {
  readonly setUpResponse: SetUp2FA | null;
}

type Step = 1 | 2 | 3;

export default function Setup2FAView({ setUpResponse }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const initialVerifyState = { message: null, success: false };

  const [verifyState, verifyAction, verifyPending] =
    useActionState<Verify2FAState, FormData>(verify2FAAction, initialVerifyState);

  const [qr, setQr] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TwoFactorSchema>({
    resolver: zodResolver(twoFactorSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    startTransition(() => {
      verifyAction(fd);
    });
  };

  useEffect(() => {
    if (setUpResponse?.qrUrl) {
      QRCode.toDataURL(setUpResponse.qrUrl).then(setQr);
    }
  }, [setUpResponse]);

  useEffect(() => {
    if (verifyState?.success) {
      setStep(3);
    }
  }, [verifyState]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3) as Step);

  const prevStep = () => {
    reset();
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  return (
    <Card>
      <div className={styles.container}>

        <StepBlock
          current={step}
          step={1}
          label="Configurar aplicación"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>
              Descargue la aplicación de Google Authenticator y escanea el código.
            </p>

            {qr ? (
              <div className={styles.qrContainer}>
                <Image src={qr} alt="QR Code" width={200} height={200} />
              </div>
            ) : (
              <p>Cargando código QR...</p>
            )}

            <div className={styles.actionsEnd}>
              <CustomButton onClick={nextStep}>
                Siguiente
              </CustomButton>
            </div>
          </div>
        </StepBlock>

        <StepBlock
          current={step}
          step={2}
          label="Verificar código"
        >
          <form
            ref={formRef}
            action={verifyAction}
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >

            <p>Introduce el código de 6 dígitos generado por la aplicación.</p>

            <CustomInput
              label="Código:"
              placeholder='123456'
              {...register("code")}
              error={errors.code}
            />

            {verifyState?.message && (
              <p className={stylesForm.errorMessage}>
                {verifyState?.message}
              </p>
            )}

            <input type="hidden" name="secret" value={setUpResponse?.secret || ''} />

            <div className={styles.actionsRow}>
              <CustomButton type="button" variant="secondary" onClick={prevStep}>
                Atrás
              </CustomButton>

              <CustomButton type="submit" isLoading={verifyPending}>
                Confirmar
              </CustomButton>
            </div>

          </form>
        </StepBlock>

        <StepBlock
          current={step}
          step={3}
          label="Completado"
        >
          <p>✅ Autenticación en dos pasos activada correctamente.</p>
        </StepBlock>

      </div>
    </Card>
  );
}

type StepBlockProps = {
  readonly current: number;
  readonly step: number;
  readonly label: string;
  readonly children: React.ReactNode;
}

function StepBlock({ current, step, label, children }: StepBlockProps) {

  const isActive = current === step;
  const isCompleted = current > step;

  let circleStatusClass = styles.circleInactive;
  if (isCompleted) {
    circleStatusClass = styles.circleCompleted;
  } else if (isActive) {
    circleStatusClass = styles.circleActive;
  }

  const circleClass = `
    ${styles.circle}
    ${circleStatusClass}
  `;

  return (
    <div className={styles.stepBlock}>

      {/* Timeline */}
      <div className={styles.timeline}>

        <div className={circleClass}>
          {isCompleted ? '✓' : step}
        </div>

        {step !== 3 && <div className={styles.line} />}

      </div>

      {/* Content */}
      <div className={styles.content}>

        <div className={`${styles.title} ${isActive ? styles.titleActive : ''}`}>
          Paso {step}: {label}
        </div>

        {isActive && (
          <div className={styles.innerContent}>
            {children}
          </div>
        )}

      </div>
    </div>
  );
}