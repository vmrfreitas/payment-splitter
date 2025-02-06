import { Request, Response } from 'express';
import { ParticipantService } from '../service/participant.service';

export class ParticipantController { 
    static async getAllParticipantsInGroup(req: Request, res: Response) {
        const Participants = await ParticipantService.getAllParticipantsInGroup(req.params.groupId);
        res.status(200).json(Participants);
    }

    static async addParticipantsToGroup(req: Request, res: Response) {
        const participants = await ParticipantService.addParticipantsToGroup(req.params.groupId, req.body.userIds);         
        res.status(201).json({ message: "Participants added successfully", participants }); 
    }

    static async removeParticipantFromGroup(req: Request, res: Response) {
        ParticipantService.removeParticipantFromGroup(req.params.groupId, req.params.userId);
        res.status(200).json({ message: "Participant removed successfully" });
    }
}