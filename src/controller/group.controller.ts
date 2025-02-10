import { Request, Response } from 'express';
import { GroupService } from '../service/group.service';
import { injectable } from 'tsyringe';

@injectable()
export class GroupController {
    constructor(private groupService: GroupService) {}

    async createGroup(req: Request, res: Response) {
        const group = await this.groupService.createGroup(req.body.name, req.body.userIds)
        res.status(201).json({ message: "Group created successfully", group });
    }

    async getAllGroups(req: Request, res: Response) {
        const groups = await this.groupService.getAllGroups();
        res.status(200).json(groups);
    }

    async getGroup(req: Request, res: Response) {
        const group = await this.groupService.getGroup(req.params.id);
        res.status(200).json(group);
    }

    async updateGroupName(req: Request, res: Response) {
        const group = await this.groupService.updateGroupName(req.body.name, req.params.id);
        res.status(200).json({ message: "Group name changed successfully", group });
    }

    async removeGroup(req: Request, res: Response) {
        await this.groupService.removeGroup(req.params.id);
        res.status(200).json({ message: "Group deleted successfully" });
    }

    async getTransactionHistory(req: Request, res: Response) {
        const transactions = await this.groupService.getTransactionHistory(req.params.id);
        res.status(200).json(transactions);
    }
}