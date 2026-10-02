import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export async function registerService({ nama, telepon, email, password, role = "user" }) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (transaction) => {
    const newUser = await transaction.user.create({
      data: { nama, email, password: hashedPassword, role },
    });

    await transaction.pelanggan.create({
      data: { userId: newUser.id, nama, telepon },
    });

    return newUser;
  });

  return {
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    },
  };
}

export async function loginService(email, password) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Email tidak ditemukan");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Password salah");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    },
  };
}