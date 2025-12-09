import { prisma } from "../../config/database";
import { LoginDto, RegisterDto } from "./auth.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "super-secret-key"; // sonra .env'ye taşıyacağız

export async function register(data: RegisterDto) {
  if (!data.email || !data.password || !data.name) {
    throw new Error("Missing fields");
  }

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function login(data: LoginDto) {
  if (!data.email || !data.password) {
    throw new Error("Missing fields");
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
}
