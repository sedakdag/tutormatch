import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import { LoginDto, RegisterDto } from "./auth.types";

export async function register(req: Request, res: Response) {
  try {
    const body = req.body as RegisterDto;
    const user = await AuthService.register(body);
    res.status(201).json({ message: "User created", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = req.body as LoginDto;
    const token = await AuthService.login(body);
    res.json({ message: "Login successful", token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
