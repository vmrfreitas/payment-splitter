import { Request, Response } from 'express';
import { SettlementService } from '../service/settlement.service';
import { injectable } from 'tsyringe';

@injectable()
export class SettlementController { 
    constructor(private settlementService: SettlementService) {}

    async getAllSettlementsFromGroup(req: Request, res: Response) {
        const settlements = await this.settlementService.getAllSettlementsFromGroup(req.params.groupId);
        res.status(200).json(settlements);
    }

    async addOneSettlementToGroup(req: Request, res: Response) {
        const { amount, payerId, payeeId } = req.body; 
        const settlements = await this.settlementService.addOneSettlementToGroup(req.params.groupId, amount, payerId, payeeId);         
        res.status(201).json({ message: "Settlement added successfully", settlements }); 
    }

    async removeSettlementFromGroup(req: Request, res: Response) {
        this.settlementService.removeSettlementFromGroup(req.params.groupId, req.params.id);
        res.status(200).json({ message: "Settlement removed successfully" });
    }
}