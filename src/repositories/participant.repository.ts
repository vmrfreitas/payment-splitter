import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Participant } from "../entity/Participant.entity";

export class ParticipantRepository {
    private repository: Repository<Participant>;

    constructor() {
        this.repository = AppDataSource.getRepository(Participant);
    }

    async findByGroupId(groupId: string): Promise<Participant[] | null> { 
        return await this.repository.findBy({ groupId: groupId });
    }

    async findOneByUserIdAndGroupId(userId: string, groupId: string): Promise<Participant | null> {
        return await this.repository.findOne({ where: { userId, groupId } });
    }

    async saveMany(participants: Participant[]): Promise<Participant[]> {
        return await this.repository.save(participants);
    }

    async removeSingle(participant: Participant): Promise<Participant> {
        return await this.repository.remove(participant);
    }

    async removeMany(participants: Participant[]): Promise<Participant[]> {
        return await this.repository.remove(participants);
    }
}
