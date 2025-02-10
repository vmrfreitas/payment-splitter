import "reflect-metadata";
import {container} from "tsyringe";
import {UserController} from "./user.controller";
import { UserService } from "../service/user.service";

container.register(UserService, { useClass: UserService });
container.register(UserController, { useClass: UserController });
