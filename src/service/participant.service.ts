import { Participant } from "../entity/Participant.entity";
import { User } from "../entity/User.entity";
import { Group } from "../entity/Group.entity";
import { GroupRepository } from "../repositories/group.repository";
import { UserRepository } from "../repositories/user.repository";
import { ParticipantRepository } from "../repositories/participant.repository";
import { injectable } from "tsyringe";

@injectable()
export class ParticipantService {
    constructor(private userRepository: UserRepository, private participantRepository: ParticipantRepository, private groupRepository: GroupRepository) {}

    async addParticipantsToGroup(groupId: string, userIds: string[]): Promise<Participant[]> {

        const group = await this.groupRepository.findByIdWithParticipants(groupId);
        const users = await this.userRepository.findByIds(userIds);

        if (!group || users.length !== userIds.length) {
            throw new Error("Group or users not found");
        }

        const participants = this.buildParticipants(users, group);
 
        await this.participantRepository.saveMany(participants);
        return participants;
    }

    async getAllParticipantsInGroup(groupId: string): Promise<Participant[]> {
        return await this.participantRepository.findByGroupId(groupId);
    }

    async updateParticipantsBalance() {
        
    }

    async removeParticipantFromGroup(groupId: string, userId: string) {
        const participant = await this.participantRepository.findOneByUserIdAndGroupId(userId, groupId);
        await this.participantRepository.removeSingle(participant);
    }

    private buildParticipants(users: User[], group: Group): Participant[] {
        return users.map((user) => {
            const participant = new Participant();
            participant.user = user;
            participant.group = group;
            participant.balance = 0;
            return participant;
        });
    }
}