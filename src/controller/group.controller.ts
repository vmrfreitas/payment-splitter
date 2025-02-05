import { Request, Response } from 'express';
import { GroupRepository } from '../repositories/group.repository';
import { UserRepository } from '../repositories/user.repository';
import { ParticipantRepository } from '../repositories/participant.repository';
import { Group } from '../entity/Group.entity';
import { In } from 'typeorm';
import { Raw } from "typeorm"
import { Participant } from '../entity/Participant.entity';
import { randomUUID } from 'crypto';

export class GroupController { 

    static async createGroup(req: Request, res: Response) {
        const { name, userIds } = req.body; // TODO: Validate request body, use jet-validator maybe
        const group = new Group()
        group.name = name;
        await GroupRepository.save(group);
   
        const users = await UserRepository.find({ where: { id: In(userIds) } });
    

        const participants = users.map((user) => {
            const participant = new Participant();
            participant.user = user;
            participant.group = group;
            participant.balance = 0;
            return participant;
        });

        await ParticipantRepository.save(participants);
        res.status(201).json({ message: "Group created successfully", group }); 
    }

    static async getGroups(req: Request, res: Response) {
        const groups = await GroupRepository.find();
        res.status(200).json(groups);
    }
}