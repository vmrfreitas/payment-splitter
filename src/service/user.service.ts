import { UserRepository } from "../repositories/user.repository";
import { ParticipantRepository } from "../repositories/participant.repository";
import { User } from "../entity/User.entity";
import { injectable } from "tsyringe";

@injectable()
export class UserService {

    constructor(private userRepository: UserRepository, private participantRepository: ParticipantRepository) {}

    async createUser(name: string, email: string) {
        const user = new User();
        user.name = name;
        user.email = email;
        return await this.userRepository.saveSingle(user);
    }

    async getAllUsers() {
        return await this.userRepository.findAll();
    }

    async getUser(userId: string) {
        return await this.userRepository.findByIdWithParticipants(userId);
    }

    async deleteUser(userId: string) {
        const user = await this.userRepository.findByIdWithParticipants(userId);
        const participants = user.participants;
        await this.participantRepository.removeMany(participants);
        await this.userRepository.removeSingle(user);
    }   

}