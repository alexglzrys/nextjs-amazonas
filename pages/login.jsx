import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from "next/router";


const LoginScreen = () => {
    // Importar el hook personalizado integrado en la librería React Hook Form para el manejo y gestión de formularios
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  // La cadena de consulta pasada a la ruta
  const {redirect} = router.query;
  
  const {data: session} = useSession();

  // Lanzar este edecto secundario cada vez que la session, el queryString o el router cambien
  // Es el encargado de redireccionar a usuarios previamente autenticados para que no accedan a la pantalla de login
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [redirect, router, session]);

  // Controlador para enviar los datos del formulario de autenticación
  const submitHandler = async({email, password}) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  };

  return (
    <Layout title="Login">
        {/* Informar a React Hook Forms el controlador a usar al enviar el formulario */}
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto max-w-screen-md"
      >
        <h1 className="mb-4 text-lg">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          {/* Informar a React Hook Form el registro de este campo para su gestión */}
          <input
            type="email"
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Ingrese un correo electrónico válido",
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          />
          {/* En caso de existir errres de validación con este campo, mostrarlos en pantalla */}
          {errors.email && (
            <div className="text-red-500 mt-2">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Contraseña</label>
          {/* Informar a React Hook Form el registro de este campo para su gestión */}
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe ser de al menos 6 caracteres",
              },
            })}
            className="w-full"
            id="password"
          />
          {errors.password && (
            <div className="text-red-500 mt-2">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4">
          No tienes una cuenta? &nbsp;<Link href="/register">Registrate</Link>
        </div>
      </form>
    </Layout>
  );
};

export default LoginScreen;
