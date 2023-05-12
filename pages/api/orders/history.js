import Order from "@/models/Order";
import db from "@/utils/db";
import { getToken } from "next-auth/jwt";

const handler = async(req, res) => {
    // Obtener token de usuario (generado durante la autenticación)
    const user = await getToken({req})
    if (!user) {
        return res.status(401).send({message: 'Autenticación requerida'})
    }
    // Obtener todo el historial de pedidos para el usuario actualmente logeado
    await db.connect()
    const orders = await Order.find({user: user._id})
    await db.disconnect();

    res.send(orders);
}

export default handler;