import { UserRepository } from "../repositories/user.repository";
import { ParticipantRepository } from "../repositories/participant.repository";
import { User } from "../entity/User.entity";
import { injectable } from "tsyringe";

@injectable()
export class UserService {

    async createUser(name: string, email: string) {
        const user = new User();
        user.name = name;
        user.email = email;
        return await UserRepository.save(user);
    }

    async getAllUsers() {
        return await UserRepository.find();
    }

    async getUser(userId: string) {
        return await UserRepository.findOne({ relations: ["participants"], where: { id: userId } });
    }

    async deleteUser(userId: string) {
        const user = await UserRepository.findOne({ relations: ["participants"], where: { id: userId } });
        const participants = user.participants;
        await ParticipantRepository.remove(participants);
        await UserRepository.remove(user);
    }   

}