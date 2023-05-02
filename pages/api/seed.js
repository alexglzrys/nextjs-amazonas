import db from '@/utils/db'
import User from '@/models/User'
import data from '@/utils/data';

const handler = async(req, res) => {
    // Sembrar usuarios dummy en la colección users 
    await db.connect();
    await User.deleteMany()
    await User.insertMany(data.users)
    await db.disconnect()
    res.send({message: 'datos sembrados correctamente'});
}
export default handler;