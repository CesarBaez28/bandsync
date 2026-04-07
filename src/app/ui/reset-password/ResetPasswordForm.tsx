'use client';

import CustomInput from "@/app/ui/inputs/CustomInput";
import stylesForm from '@/app/styles/form.module.css'
import CustomLink from "@/app/ui/link/CustomLink";
import CustomButton from "@/ui/button/CustomButton";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema, resetPasswordSchema } from "@/app/lib/schemas/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { resetPasswordAction, ResetPasswordState } from "@/app/lib/actions/users";
import { useToast } from "../toast/ToastContext";
import { useRouter } from "next/navigation";

type FormProps = {
  readonly token: string;
}

export default function ResetPasswordForm({ token }: FormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<ResetPasswordState, FormData>(resetPasswordAction, initialState)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
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
      state.success = false;
      state.message = null;
      state.errors = {};
      showToast('Contraseña restablecida con éxito! Ya puedes iniciar sesión con tu nueva contraseña.', 'success', 5000);
      router.push('/login');
    }
  }, [state, showToast, router])

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={stylesForm.fieldsContainer + ' col-12 col-sm-8 col-md-6 col-lg-5'}>
        <CustomInput
          label='Contraseña:'
          type='password'
          placeholder='Ingrese la nueva contraseña'
          {...register('newPassword')}
          error={errors.newPassword}
        />

        <CustomInput
          label='Confirmar contraseña:'
          type='password'
          placeholder='Confirma tu contraseña'
          {...register('confirmPassword')}
          error={errors.confirmPassword}
        />

        <input type="hidden" name="token" value={token} />

        {state?.message && (
          <p className={stylesForm.errorMessage}>
            {state?.message}
          </p>
        )}

      </div>

      <div className={stylesForm.fieldsContainer} style={{ marginTop: '25px' }}>
        <div className={stylesForm.buttonsContainer}>
          <CustomLink buttonStyle={true} href='/login' variant='secondary'>
            Cancelar
          </CustomLink>
          <CustomButton isLoading={isPending} type='submit'>
            Guardar
          </CustomButton>
        </div>
      </div>
    </form>
  )
}