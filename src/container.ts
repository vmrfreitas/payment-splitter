import { container } from "tsyringe";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { GroupController } from "./controller/group.controller";
import { GroupService } from "./service/group.service";
import { ParticipantService } from "./service/participant.service";
import { EmailService } from "./service/email.service";
import { UserRepository } from "./repository/user.repository";
import { ExpenseService } from "./service/expense.service";
import { SettlementService } from "./service/settlement.service";
import { ExpenseController } from "./controller/expense.controller";
import { ParticipantController } from "./controller/participant.controller";
import { SettlementController } from "./controller/settlement.controller";
import { S3Service } from "./service/s3.service";
import { SettlementRepository } from "./repository/settlement.repository";
import { ParticipantRepository } from "./repository/participant.repository";
import { ExpenseRepository } from "./repository/expense.repository";
import { GroupRepository } from "./repository/group.repository";
import { ExpenseCalculator } from "./util/expense.calculator";
import { DataSource } from "typeorm";
import { AppDataSource } from "./data-source";

// Controllers
container.register("UserController", { useClass: UserController });
container.register("GroupController", { useClass: GroupController });
container.register("ExpenseController", { useClass: ExpenseController });
container.register("ParticipantController", { useClass: ParticipantController });
container.register("SettlementController", { useClass: SettlementController });

// Services
container.register("UserService", { useClass: UserService });
container.register("ExpenseService", { useClass: ExpenseService });
container.register("GroupService", { useClass: GroupService });
container.register("ParticipantService", { useClass: ParticipantService });
container.register("SettlementService", { useClass: SettlementService });
container.registerSingleton("EmailService", EmailService);
container.registerSingleton("S3Service", S3Service);

// Repositories
container.registerInstance(DataSource, AppDataSource);
container.register(UserRepository, {
    useFactory: () => new UserRepository(container.resolve(DataSource))
});
container.register(SettlementRepository, {
    useFactory: () => new SettlementRepository(container.resolve(DataSource))
});
container.register(ParticipantRepository, {
    useFactory: () => new ParticipantRepository(container.resolve(DataSource))
});
container.register(ExpenseRepository, {
    useFactory: () => new ExpenseRepository(container.resolve(DataSource))
});
container.register(GroupRepository, {
    useFactory: () => new GroupRepository(container.resolve(DataSource))
});

// Utils
container.registerSingleton("ExpenseCalculator", ExpenseCalculator);