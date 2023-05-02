import "@/styles/globals.css";
import { StoreProvider } from "@/utils/Store";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps: {session, ...pageProps} }) {
  return (
    // Session Provider es el que nos permite saber si el usuario esta o no autenticado 
    <SessionProvider session={session}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}
