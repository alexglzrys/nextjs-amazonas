// Registrar usuario

import User from "@/models/User";
import db from "@/utils/db";
import bcryptjs from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "POST") return;
  // Recuperar información enviada en el cuerpo de la petición
  const { name, email, password } = req.body;
  // Validaciónes básicas
  if (
    !name ||
    !email ||
    !password ||
    !email.includes("@") ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Error de validación",
    });
    return;
  }

  // conectar con base de datos
  await db.connect();

  // Verificar si el usuario por registrar ya existe en la base de datos
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: "El usuario ya existe" });
    await db.disconnect();
    return;
  }

  // Registrar el nuevo usuario en la base de datos
  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });
  const user = await newUser.save();

  res.status(201).send({
    message: "Usuario registrado correctamente",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

export default handler;
