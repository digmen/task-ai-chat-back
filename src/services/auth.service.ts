import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserRepo from '../db/user.repository.js';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const registerUser = async (email: string, password: string) => {
    const existingUser = UserRepo.findUserByEmail(email);
    if (existingUser) throw new AppError('Email already registered', 409);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = UserRepo.createUser(email, hashedPassword);
    const token = generateToken(newUser.id!, newUser.email!);

    return { token, user: newUser };
};

export const loginUser = async (email: string, password: string) => {
    const user = UserRepo.findUserByEmail(email);
    if (!user || !user.password) throw new AppError('Invalid credentials', 401);

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) throw new AppError('Invalid credentials', 401);

    const token = generateToken(user.id, user.email);
    
    const { password: _, ...userWithoutPass } = user;
    return { token, user: userWithoutPass };
};

const generateToken = (id: number, email: string): string => {
    return jwt.sign({ id, email }, config.JWT_SECRET, { expiresIn: '7d' });
};