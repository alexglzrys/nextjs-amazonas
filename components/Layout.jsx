import { Store } from "@/utils/Store";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children, title }) => {
  // Usar el contexto del carrito de la compra
  const { state } = useContext(Store);
  const { cart } = state;

  const { status, data: session } = useSession();

  // Evitar problema de hidratación - calcular la cantidad de productos agregasdos en el carrito solo en el cliente
  const [cartItemsCount, setCartItemsCount] = useState(0);
  // Recalcular la cantidad de productos agregados al carrito si el listado cambia
  useEffect(() => {
    setCartItemsCount(
      cart.cartItems.reduce((acum, item) => acum + item.quantity, 0)
    );
  }, [cart.cartItems]);

  return (
    <>
      <Head>
        <title>{title ? title + " - Amazonas" : "Amazonas"}</title>
        <meta name="description" content="Ecommerce desarrollado en NextJS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Lugar y posición dónde se mostrarán todos los mensajes de alerta */}
      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex flex-col justify-between min-h-screen">
        <header className="flex justify-between items-center shadow-md px-4 h-12">
          <Link href="/" className="font-bold text-lg">
            Amazonas
          </Link>
          <div>
            <Link href="/cart" className="p-2">
              Cart{" "}
              {cartItemsCount > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  {/* Generar una sumatoria de la cantidad de productos agregados al carrito de compras */}
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Verificar si hay usuario autenticado  */}
            {status === "loading" ? (
              "Cargando"
            ) : session?.user ? (
              session.user.name
            ) : (
              <Link href="/login" className="p-2">
                Login
              </Link>
            )}
          </div>
        </header>
        <main className="container mt-4 px-4 m-auto">{children}</main>
        <footer className="flex justify-center items-center h-10 shadow-inner">
          Amazonas &copy; 2023. Todos los derechos reservados
        </footer>
      </div>
    </>
  );
};

export default Layout;
