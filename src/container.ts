import { container } from "tsyringe";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { GroupController } from "./controller/group.controller";
import { GroupService } from "./service/group.service";
import { ParticipantService } from "./service/participant.service";
import { EmailService } from "./service/email.service";
import { UserRepository } from "./repositories/user.repository";
import { ExpenseService } from "./service/expense.service";
import { SettlementService } from "./service/settlement.service";
import { ExpenseController } from "./controller/expense.controller";
import { ParticipantController } from "./controller/participant.controller";
import { SettlementController } from "./controller/settlement.controller";

// Controllers
container.register("UserController", { useClass: UserController });
container.register("GroupController", { useClass: GroupController });
container.register("ExpenseController", { useClass: ExpenseController });
container.register("ParticipantController", { useClass: ParticipantController });
container.register("SettlementController", { useClass: SettlementController });

// Services
container.register("UserService", { useClass: UserService });
container.register("ExpenseService", {useClass: ExpenseService});
container.register("GroupService", { useClass: GroupService });
container.register("ParticipantService", { useClass: ParticipantService });
container.register("SettlementService", { useClass: SettlementService });
container.registerSingleton("EmailService", EmailService);

// Repositories
container.registerSingleton("UserRepository", UserRepository);
