'use client';

import stylesForm from '@/app/styles/form.module.css'
import CustomLink from '@/app/ui/link/CustomLink';
import CustomButton from '@/app/ui/button/CustomButton';
import CustomInput from '@/app/ui/Inputs/CustomInput';
import { startTransition, useActionState, useEffect, useRef } from 'react';
import { forgotPasswordAction, ForgotPasswordState } from '@/app/lib/actions/users';
import { forgotPasswordSchema, ForgotPasswordSchema } from '@/app/lib/schemas/forgotPasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../toast/ToastContext';

export default function ForgotPasswordForm() {
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<ForgotPasswordState, FormData>(forgotPasswordAction, initialState)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
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
      showToast(
        'Si el correo ingresado corresponde a una cuenta registrada, recibirás un email con instrucciones para restablecer tu contraseña.',
        'info',
        6000);
    }
  }, [state, showToast])

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={stylesForm.fieldsContainer + ' col-12 col-sm-8 col-md-6 col-lg-5'}>
        <CustomInput
          label='Correo electrónico:'
          type='email'
          placeholder='Ingresa tu correo electrónico'
          {...register('email')}
          error={errors.email}
        />

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
  );
}