'use client';

import { disable2FAAction, Disable2FAState } from "@/app/lib/actions/2fa";
import CustomButton from "@/ui/button/CustomButton";
import Card from "@/ui/Card/Card";
import CustomLink from "@/ui/link/CustomLink";
import { useActionState, useEffect } from "react";
import { useToast } from "../toast/ToastContext";
import { useRouter } from "next/navigation";

type Props = {
  readonly hypName?: string;
  readonly is2FAEnabled: boolean;
}

export default function TwoFactorOptions({ hypName, is2FAEnabled }: Props) {
  const { showToast } = useToast();
  const router = useRouter();

  const initialDisableState = { message: null, success: false };

  const [disableState, disableAction, disablePending] =
    useActionState<Disable2FAState, FormData>(disable2FAAction, initialDisableState);

  useEffect(() => {
    if (disableState?.success) {
      disableState.success = false;
      disableState.message = null;
      showToast('Autenticación en dos pasos deshabilitada con éxito!', 'success');
      router.push(hypName ? `/musicalbands/${hypName}/two-factor` : '/two-factor');
    }
  }, [disableState, hypName, router, showToast]);

  return <>
    <h2>Administrar autenticación en dos pasos</h2>
    <p>A continuación, puedes configurar la autenticación en dos pasos para mejorar la seguridad de tu cuenta.</p>
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Usar aplicación de autenticación</h3>
        <p>Una aplicación en su dispositivo genera los códigos de verificación</p>

        <div style={{ display: 'flex', gap: '.4rem' }}>
          <CustomLink buttonStyle={true} href={hypName ? `/musicalbands/${hypName}/two-factor/configure` : '/two-factor/configure'}>
            {is2FAEnabled ? 'Reiniciar 2FA' : 'Configurar 2FA'}
          </CustomLink>
          {is2FAEnabled && (
            <form action={disableAction}>
              <CustomButton type="submit" isLoading={disablePending}>
                Quitar 2FA
              </CustomButton>
            </form>
          )}
        </div>
      </div>
    </Card>
  </>
}