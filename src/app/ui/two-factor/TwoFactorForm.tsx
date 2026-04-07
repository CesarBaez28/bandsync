'use client';

import styleForm from '@/app/styles/form.module.css'
import { authenticateWith2FA } from "@/app/lib/actions/auth";
import { twoFactorSchema, TwoFactorSchema } from "@/app/lib/schemas/twoFactorSchema";
import CustomInput from "@/app/ui/inputs-temporal/CustomInput";
import CustomButton from "@/app/ui/button/CustomButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useRef } from "react";
import { useForm } from "react-hook-form";

export default function TwoFactorForm({ tempToken }: { readonly tempToken: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const [errorMessage, formAction, isPending] = useActionState(authenticateWith2FA, undefined)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TwoFactorSchema>({
    resolver: zodResolver(twoFactorSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    startTransition(() => {
      formAction(fd);
    });
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >

      <h2>Verificación en dos pasos</h2>

      <p>Introduce el código de Google Authenticator</p>

      <CustomInput
        label="Código:"
        placeholder='123456'
        {...register("code")}
        error={errors.code}
      />

      {errorMessage && (
        <p className={styleForm.errorMessage}>
          {errorMessage}
        </p>
      )}

      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <input type="hidden" name="tempToken" value={tempToken} />

      <div>
        <CustomButton type="submit" isLoading={isPending}>
          Verificar
        </CustomButton>
      </div>

    </form>
  );
}