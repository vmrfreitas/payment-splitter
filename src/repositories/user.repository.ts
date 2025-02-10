import { In, Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async findAll(): Promise<User[] | null> {
        return this.repository.find();
    }

    async findById(id: string): Promise<User | null> {
        return this.repository.findOneBy({ id });
    }

    async findByIdWithParticipants(id: string): Promise<User | null> {
        return this.repository.findOne({ relations: ["participants"], where: { id } });
    }

    async findByIds(ids: string[]): Promise<User[] | null> {
        return this.repository.find({ where: { id: In(ids) } })
    }

    async saveSingle(user: User): Promise<User> {
        return this.repository.save(user);
    }

    async removeSingle(user: User): Promise<User> {
        return this.repository.remove(user);
    }
}