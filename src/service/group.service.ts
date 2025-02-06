import { AppDataSource } from "../data-source";
import { Participant } from "../entity/Participant.entity";
import { User } from "../entity/User.entity";
import { Group } from "../entity/Group.entity";
import { In } from "typeorm";
import { GroupRepository } from "../repositories/group.repository";
import { UserRepository } from "../repositories/user.repository";
import { group } from "console";
import { ParticipantRepository } from "../repositories/participant.repository";

export class GroupService {

        static async createGroup(name: string, userIds: string[]) {
            const group = new Group()
            group.name = name;
            await GroupRepository.save(group);
       
            const users = await UserRepository.find({ where: { id: In(userIds) } });
    
            const participants = users.map((user) => {
                const participant = new Participant();
                participant.user = user;
                participant.group = group;
                participant.balance = 0;
                return participant;
            });
    
            await ParticipantRepository.save(participants);
            return group;
        }

    
        static async updateGroupName(name: string, groupId: string) {
            const group = await GroupRepository.findOneBy({ id: groupId });
            group.name = name;
            return await GroupRepository.save(group);
        }
    
        static async getAllGroups() {
            return await GroupRepository.find({ relations: ["participants"] });
        }
    
        static async getGroup(groupId: string) {
            const group = await GroupRepository.findOne({ relations: ["participants"], where: { id: groupId } });
            return group;
        }

        static async removeGroup(groupId: string) {
            const group = await GroupRepository.findOne({ relations: ["participants"], where: { id: groupId } });
            const participants = group.participants;
            await ParticipantRepository.remove(participants);
            await GroupRepository.remove(group);
        }

}