import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';

export class UserController { 
    static async getUsers(req: Request, res: Response) {
        const users = await UserRepository.find();
        res.status(200).json(users);
    }
}