import { Request, Response } from 'express';
import { GroupRepository } from '../repositories/group.repository';
import { UserRepository } from '../repositories/user.repository';
import { Group } from '../entity/Group.entity';
import { In } from 'typeorm';
import { Raw } from "typeorm"

export class GroupController { 

    static async createGroup(req: Request, res: Response) {
        const { name, userIds } = req.body; // TODO: Validate request body, use jet-validator maybe
        const group = new Group()
        group.name = name;
        const users = await UserRepository.find({ where: { id: In(userIds) } });
        group.users = users;
        await GroupRepository.save(group);
        res.status(201).json({ message: "Group created successfully", group }); 
    }

    static async getGroups(req: Request, res: Response) {
        const groups = await GroupRepository.find();
        res.status(200).json(groups);
    }
}