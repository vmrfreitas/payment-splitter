import { UserRepository } from "../repositories/user.repository";
import { ParticipantRepository } from "../repositories/participant.repository";
import { User } from "../entity/User.entity";

export class UserService {

    static async createUser(name: string) {
        const user = new User();
        user.name = name;
        return await UserRepository.save(user);
    }

    static async getAllUsers() {
        return await UserRepository.find();
    }

    static async getUser(userId: string) {
        return await UserRepository.findOne({ relations: ["participants"], where: { id: userId } });
    }

    static async deleteUser(userId: string) {
        const user = await UserRepository.findOne({ relations: ["participants"], where: { id: userId } });
        const participants = user.participants;
        await ParticipantRepository.remove(participants);
        await UserRepository.remove(user);
    }   

}