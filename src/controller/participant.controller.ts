import { Request, Response } from 'express';
import { ParticipantService } from '../service/participant.service';
import { injectable } from 'tsyringe';

@injectable()
export class ParticipantController { 
    constructor(private participantService: ParticipantService) {}

    async getAllParticipantsInGroup(req: Request, res: Response) {
        const Participants = await this.participantService.getAllParticipantsInGroup(req.params.groupId);
        res.status(200).json(Participants);
    }

    async addParticipantsToGroup(req: Request, res: Response) {
        const participants = await this.participantService.addParticipantsToGroup(req.params.groupId, req.body.userIds);         
        res.status(201).json({ message: "Participants added successfully", participants }); 
    }

    async removeParticipantFromGroup(req: Request, res: Response) {
        this.participantService.removeParticipantFromGroup(req.params.groupId, req.params.userId);
        res.status(200).json({ message: "Participant removed successfully" });
    }
}