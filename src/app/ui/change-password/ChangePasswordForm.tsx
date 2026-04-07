'use client';

import CustomInput from "@/app/ui/Inputs/CustomInput";
import stylesForm from '@/app/styles/form.module.css'
import CustomLink from "@/app/ui/link/CustomLink";
import { useForm } from "react-hook-form";
import { changePasswordSchema, ChangePasswordSchema } from "@/app/lib/schemas/changePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import CustomButton from "@/app/ui/button/CustomButton";
import { changePasswordAction, ChangePasswordState } from "@/app/lib/actions/users";
import { useToast } from "@/app/ui/toast/ToastContext";
import { useRouter } from "next/navigation";

type FormProps = {
  readonly hypName?: string;
};

export default function Form({ hypName }: FormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<ChangePasswordState, FormData>(changePasswordAction, initialState)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
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
      showToast('Contraseña cambiada con éxito!', 'success');
      state.success = false;
      state.message = null;
      state.errors = {};
      router.push(hypName ? `/musicalbands/${hypName}/profile` : '/profile');
    }
  }, [state, hypName, router, showToast])

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={stylesForm.fieldsContainer + ' col-12 col-sm-8 col-md-6 col-lg-5'}>

        <CustomInput
          label='Contraseña actual:'
          type='password'
          {...register("currentPassword")}
          error={errors.currentPassword}
        />

        <CustomInput
          label='Nueva contraseña:'
          type='password'
          {...register("newPassword")}
          error={errors.newPassword}
        />

        <CustomInput
          label='Confirmar nueva contraseña:'
          type='password'
          {...register("confirmNewPassword")}
          error={errors.confirmNewPassword}
        />

        {state?.message && (
          <p className={stylesForm.errorMessage}>
            {state?.message}
          </p>
        )}

      </div>
      <div className={stylesForm.fieldsContainer} style={{ marginTop: '25px' }}>

        <div className={stylesForm.buttonsContainer}>
          <CustomLink buttonStyle={true} href={hypName ? `/musicalbands/${hypName}/profile` : '/profile'} variant='secondary'>
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