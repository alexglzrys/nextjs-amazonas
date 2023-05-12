import Order from "@/models/Order";
import db from "@/utils/db";
import { getToken } from "next-auth/jwt";

const handler = async(req, res) => {
    const user = await getToken({req});
    if (!user) {
        return res.status(401).send('Autenticación requerida')
    }
    await db.connect();
    // Buscar orden de pedido
    const order = await Order.findById(req.query.id);
    if (order) {
        if (order.isPaid) {
            return res.status(400).send({message: 'La orden ya fue pagada'})
        }
        // Actualizar información de orden de pedido (se acaba de pagar por paypal)
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address
        };
        const paidOrder = await order.save();
        await db.disconnect();
        res.send({message: 'Orden de pedido pagada correctamente', order: paidOrder})
    } else {
        await db.disconnect();
        res.status(400).send({message: 'Orden no localizada'})
    }
}

export default handler;