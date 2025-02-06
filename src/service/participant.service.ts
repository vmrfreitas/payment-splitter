import { Participant } from "../entity/Participant.entity";
import { User } from "../entity/User.entity";
import { Group } from "../entity/Group.entity";
import { In } from "typeorm";
import { GroupRepository } from "../repositories/group.repository";
import { UserRepository } from "../repositories/user.repository";
import { ParticipantRepository } from "../repositories/participant.repository";

export class ParticipantService {
    static async addParticipantsToGroup(groupId: string, userIds: string[]): Promise<Participant[]> {

        const group = await GroupRepository.findOne({ relations: ["participants"], where: { id: groupId } });
        const users = await UserRepository.find({ where: { id: In(userIds) } });

        if (!group || users.length !== userIds.length) {
            throw new Error("Group or users not found");
        }

        const participants = this.buildParticipants(users, group);

        if (group.participants) {
            group.participants.concat(participants);
        } else {
            group.participants = participants;
        }

        await GroupRepository.save(group);
        await ParticipantRepository.save(participants);
        return participants;
    }

    static async getAllParticipantsInGroup(groupId: string): Promise<Participant[]> {
        return await ParticipantRepository.findBy({ groupId: groupId });
    }

    static async removeParticipantFromGroup(groupId: string, userId: string) {
        const participant = await ParticipantRepository.findOne({ where: { userId, groupId } });
        await ParticipantRepository.remove(participant);
    }

    private static buildParticipants(users: User[], group: Group): Participant[] {
        return users.map((user) => {
            const participant = new Participant();
            participant.user = user;
            participant.group = group;
            participant.balance = 0;
            return participant;
        });
    }
}