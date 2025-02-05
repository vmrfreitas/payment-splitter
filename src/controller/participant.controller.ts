import { Request, Response } from 'express';
import { ParticipantRepository } from '../repositories/participant.repository';

export class ParticipantController { 
    static async getAllParticipants(req: Request, res: Response) {
        const groupId = req.params.id;
        const Participants = await ParticipantRepository.findBy({ groupId: groupId });
        res.status(200).json(Participants);
    }

    static async addParticipants(req: Request, res: Response) { // TODO: remove
        const Participants = await ParticipantRepository.find();
        res.status(200).json(Participants);
    }
    static async removeParticipant(req: Request, res: Response) { // TODO: remove
        const Participants = await ParticipantRepository.find();
        res.status(200).json(Participants);
    }
}