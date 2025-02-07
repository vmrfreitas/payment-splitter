import { Request, Response } from 'express';
import { SettlementService } from '../service/settlement.service';

export class SettlementController { 
    static async getAllSettlementsFromGroup(req: Request, res: Response) {
        const settlements = await SettlementService.getAllSettlementsFromGroup(req.params.groupId);
        res.status(200).json(settlements);
    }

    static async addOneSettlementToGroup(req: Request, res: Response) {
        const { amount, payerId, payeeId } = req.body; 
        const settlements = await SettlementService.addOneSettlementToGroup(req.params.groupId, amount, payerId, payeeId);         
        res.status(201).json({ message: "Settlements added successfully", settlements }); 
    }

    static async removeSettlementFromGroup(req: Request, res: Response) {
        SettlementService.removeSettlementFromGroup(req.params.groupId, req.params.id);
        res.status(200).json({ message: "Settlement removed successfully" });
    }
}