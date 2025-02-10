import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { injectable } from "tsyringe";

@injectable()
export class UserController {
    constructor(private userService: UserService) {}

    async createUser(req: Request, res: Response) {
        const user = await this.userService.createUser(req.body.name, req.body.email);
        res.status(201).json({ message: "User created successfully", user });
    }

    async getAllUsers(req: Request, res: Response) {
        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    }

    async getUser(req: Request, res: Response) {
        const user = await this.userService.getUser(req.params.id);
        res.status(200).json(user);
    }

    async deleteUser(req: Request, res: Response) {
        await this.userService.deleteUser(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    }
}