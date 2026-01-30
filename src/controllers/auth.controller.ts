import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import * as AuthService from '../services/auth.service.js';
import * as UserRepo from '../db/user.repository.js';
import { AppError } from '../utils/AppError.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
        throw new AppError('Invalid input data', 400);
    }

    const result = await AuthService.registerUser(email, password);
    res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Credentials required', 400);

    const result = await AuthService.loginUser(email, password);
    res.json(result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = UserRepo.findUserById(req.userId!);
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
});