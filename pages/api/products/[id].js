import Product from "@/models/Product";
import db from "@/utils/db";

// API para buscar un producto por su id en base de datos
const handler = async(req, res) => {
    await db.connect()
    const product = await Product.findById(req.query.id);
    await db.disconnect()
    res.send(product)
}

export default handler;