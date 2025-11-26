'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../button/CustomButton";
import CustomInput from "../Inputs/CustomInput";
import styles from "../../styles/login-register-form.module.css";
import { FormRegisterSchema, formRegisterSchema } from "@/app/lib/schemas/formRegisterSchema";
import { registerAction, RegisterUserState } from "@/app/lib/actions/users";
import CustomLink from "../link/CustomLink";
import Modal from "../modal/Modal";

type Props = {
  token: string | undefined;
}

export default function RegisterForm({ token }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: RegisterUserState = { errors: {}, message: null, success: false };
  const [state, formAction, isPending] = useActionState<RegisterUserState, FormData>(registerAction, initialState);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormRegisterSchema>({
    resolver: zodResolver(formRegisterSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    startTransition(() => {
      formAction(fd);
    });
  };

  return <>
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <header className={styles['header']}>
          <h1>BandSync</h1>
          <p className={styles['header-description']}>
            Ingrese los siguientes datos para <br /> registrar tu cuenta
          </p>
        </header>
        <div className={styles['fields-container']}>
          <CustomInput
            label='Nombre de usuario:'
            {...register("username")}
            error={errors.username}
          />
          <CustomInput
            label='Correo electrónico:'
            type='email'
            {...register("email")}
            error={errors.email}
          />
          <CustomInput
            label='Contraseña:'
            type='password'
            {...register("password")}
            error={errors.password}
          />
          <CustomInput
            label='Confirmar contraseña:'
            type='password'
            {...register("confirmPassword")}
            error={errors.confirmPassword}
          />

          <input type="hidden" name="token" value={token || ''} />

          {state?.message && (
            <p className={styles['error-message']}>
              {state?.message}
            </p>
          )}
          <div>
            <CustomButton style={{ fontSize: '1rem' }} type='submit' isLoading={isPending} fullWidth>
              Registrarse
            </CustomButton>
          </div>
          <div className={styles['footer-container']}>
            <p>¿Ya tienes una cuenta?</p>
            <CustomLink style={{ fontWeight: 'bold', textDecoration: 'none' }} variant='tertiary' href={'/login'}>
              Inicia sesión
            </CustomLink>
          </div>
        </div>
      </div>
    </form>
    <div id="modal-root">
      <Modal
        isOpen={state.success}
        size="sm"
      >
        <div className={styles['modal-content']}>
          <p>Usuario registrado correctamente. <br /> Por favor, inicie sesión:</p>
          <CustomLink href={'/login'}>Iniciar sesión</CustomLink>
        </div>
      </Modal>
    </div>
  </>;
}