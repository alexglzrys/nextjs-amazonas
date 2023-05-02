import mongoose from "mongoose";

const connection = {}

async function connect() 
{
    // Si ya está conectado, no hacemos nada
    if (connection.isConnected) {
        console.log('ya estas conectado');
        return;
    }
    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            console.log('usando una conexión previa')
            return;
        }
        await mongoose.disconnect();
    }
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log('new connection')
    connection.isConnected = db.connections[0].readyState;
}

async function disconnect() 
{
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            await mongoose.disconnect();
            connection.isConnected = false;
        } else {
            console.log('estas en desarrollo, no te desconectaré')
        }
    }
}

const db = {connect, disconnect};
export default db;