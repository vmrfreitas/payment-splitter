import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entity/User.entity';
import { ParticipantRepository } from '../repositories/participant.repository';

export class UserController { 
    static async createUser(req: Request, res: Response) {
        const { name } = req.body;
        const user = new User();
        user.name = name;
        await UserRepository.save(user);
        res.status(201).json({ message: "User created successfully", user });
    }

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
        const participants = user.participants;
        await ParticipantRepository.remove(participants);
        await UserRepository.remove(user);
        res.status(200).json({ message: "User deleted successfully" });
    }
}