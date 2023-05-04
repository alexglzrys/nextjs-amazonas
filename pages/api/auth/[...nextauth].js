import User from "@/models/User";
import db from "@/utils/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from 'bcryptjs';

export default NextAuth({
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({token, user}) {
            // Si existe el usuario, se almacena cierta información en el token
            if (user?._id) token._id = user._id;
            if (user?.isAdmin) token.isAdmin = user.isAdmin;
            return token;
        },
        async session({session, token}) {
            // Si existe un token, se almacena cierta información en la sesión
            if (token?._id) session.user._id = token._id;
            if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
            return session;
        }
    },
    providers: [
        // Especificar los provedores de autenticación soportados por la aplicación
        CredentialsProvider({
            async authorize(credentials) {
                await db.connect()
                const user = await User.findOne({email: credentials.email})
                await db.disconnect()
                // Si existe el usuario en base de datos con las credenciales de acceso correctas, se retorna un bjeto con parte de su información para usarla en la aplicación
                if (user && bcryptjs.compareSync(credentials.password, user.password)) {
                    return {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        image: 'F',
                        isAdmin: user.isAdmin
                    };
                }
                throw new Error('Credenciales incorrectas')
            }
        })
    ]
})