import { Request, Response } from 'express';
import { ParticipantService } from '../service/participant.service';

export class ParticipantController { 
    static async getAllParticipants(req: Request, res: Response) {
        const Participants = await ParticipantService.findParticipants(req.params.groupId);
        res.status(200).json(Participants);
    }

    static async addParticipants(req: Request, res: Response) {
        const participants = await ParticipantService.addParticipants(req.params.groupId, req.body.userIds);         
        res.status(201).json({ message: "Participants added successfully", participants }); 
    }

    static async removeParticipant(req: Request, res: Response) {
        ParticipantService.removeParticipant(req.params.groupId, req.params.userId);
        res.status(200).json({ message: "Participant removed successfully" });
    }
}