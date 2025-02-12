import { DataSource, In, Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository {
    private repository: Repository<User>;

    constructor(private datasource: DataSource) {
        this.repository = datasource.getRepository(User);
    }

    async findById(id: string): Promise<User | null> {
        return this.repository.findOneBy({ id });
    }

    async findAll(): Promise<User[] | null> {
        return this.repository.find();
    }

    async findByIdWithParticipants(id: string): Promise<User | null> {
        return this.repository.findOne({ relations: ["participants"], where: { id } });
    }

    async findByIds(ids: string[]): Promise<User[]> {
        const users = await this.repository.find({ where: { id: In(ids) } });
        return users || [];
    }

    async saveSingle(user: User): Promise<User> {
        return this.repository.save(user);
    }

    async removeSingle(user: User): Promise<User> {
        return this.repository.remove(user);
    }
}