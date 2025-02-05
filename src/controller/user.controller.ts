import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';

export class UserController { 
    static async getAllUsers(req: Request, res: Response) {
        const users = await UserRepository.find();
        res.status(200).json(users);
    }

    static async getUser(req: Request, res: Response) {
        const user = await UserRepository.findOneBy({ id: req.params.id });
        res.status(200).json(user);
    }
    
    static async deleteUser(req: Request, res: Response) {
        const user = await UserRepository.findOne({ relations: ["participants"], where: { id: req.params.id } });
        await UserRepository.softRemove(user);
        res.status(200).json({ message: "User deleted successfully" });
    }
}