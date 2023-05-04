import Order from "@/models/Order";
import db from "@/utils/db";
import { getToken } from "next-auth/jwt";

const handler = async(req ,res) => {
    // Recuperar información almacenada en el token
    const user = await getToken({req})
    if (!user) {
        return res.status(401).send('La autenticación es requerida')
    }
    
    // Registrar la nueva ordern de compra en la base de datos
    await db.connect()
    const newOrder = new Order({
        ...req.body,
        user: user._id
    });
    const order = await newOrder.save();
    // devolver la order registrada como respuesta
    res.status(201).send(order);
}

export default handler