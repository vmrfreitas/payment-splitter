import { Request, Response } from 'express';
import { GroupService } from '../service/group.service';

export class GroupController {
    static async createGroup(req: Request, res: Response) {
        const group = await GroupService.createGroup(req.body.name, req.body.userIds)
        res.status(201).json({ message: "Group created successfully", group });
    }

    static async getAllGroups(req: Request, res: Response) {
        const groups = await GroupService.getAllGroups();
        res.status(200).json(groups);
    }

    static async getGroup(req: Request, res: Response) {
        const group = await GroupService.getGroup(req.params.id);
        res.status(200).json(group);
    }

    static async updateGroupName(req: Request, res: Response) {
        const group = await GroupService.updateGroupName(req.body.name, req.params.id);
        res.status(200).json({ message: "Group name changed successfully", group });
    }

    static async removeGroup(req: Request, res: Response) {
        await GroupService.removeGroup(req.params.id);
        res.status(200).json({ message: "Group deleted successfully" });
    }
}