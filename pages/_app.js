import "@/styles/globals.css";
import { StoreProvider } from "@/utils/Store";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";

// Documentación: https://next-auth.js.org/getting-started/client

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // Session Provider es el que nos permite saber si el usuario esta o no autenticado
    <SessionProvider session={session}>
      <StoreProvider>
        {/* Si el componente a renderizar tiene la propiedad auth en true, significa que es un componente protegido por autenticación */}
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=El login es requerido");
    },
  });
  if (status === "loading") {
    return <div>Cargando...</div>;
  }
  return children;
}
