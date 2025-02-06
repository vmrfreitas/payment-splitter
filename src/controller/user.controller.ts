import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entity/User.entity';
import { ParticipantRepository } from '../repositories/participant.repository';
import { UserService } from '../service/user.service';

export class UserController {
    static async createUser(req: Request, res: Response) {
        const user = await UserService.createUser(req.body.name);
        res.status(201).json({ message: "User created successfully", user });
    }

    static async getAllUsers(req: Request, res: Response) {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    }

    static async getUser(req: Request, res: Response) {
        const user = await UserService.getUser(req.params.id);
        res.status(200).json(user);
    }

    static async deleteUser(req: Request, res: Response) {
        await UserService.deleteUser(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    }
}