'use client';
import styles from './login-form.module.css'
import { startTransition, useActionState, useRef } from 'react';
import { authenticate } from '@/app/lib/actions/auth';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FormLoginSchema, formLoginSchema } from '@/app/lib/schemas/formLoginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from '../Inputs/CustomInput';
import CustomButton from '../button/CustomButton';
import CustomLink from '../link/CustomLink';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const formRef = useRef<HTMLFormElement>(null);
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormLoginSchema>({
    resolver: zodResolver(formLoginSchema),
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
    >
      <div>
        <header className={styles['login-header']}>
          <h1>BandSync</h1>
          <p className={styles['header-description']}>
            Ingrese las credenciales para <br /> entrar con tu cuenta
          </p>
        </header>
        <div className={styles['fields-container']}>
          <CustomInput
            label='Nombre de usuario:'
            {...register("username")}
            error={errors.username}
          />
          <CustomInput
            label='Contraseña:'
            type='password'
            {...register("password")}
            error={errors.password}
          />
          {errorMessage && (
            <p className={styles['error-message']}>
              {errorMessage}
            </p>
          )}
          <div>
            <CustomLink variant='tertiary' href={'/forgot-password'}>
              ¿Olvidaste tu contraseña?
            </CustomLink>
          </div>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <div>
            <CustomButton type='submit' isLoading={isPending} fullWidth>
              Iniciar sesión
            </CustomButton>
            <div className={styles['register-container']}>
              <p>¿No tienes cuenta?</p>
              <CustomLink style={{fontWeight: 'bold', textDecoration: 'none'}} variant='tertiary' href={'/register'}>
                Regístrate
              </CustomLink>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}