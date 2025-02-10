import * as express from 'express';
import { UserController } from '../controller/user.controller';
import { container } from 'tsyringe';

const Router = express.Router();
const userController = container.resolve(UserController);

Router.get("/", userController.getAllUsers.bind(userController));
Router.post("/", userController.createUser.bind(userController));
Router.get("/:id", userController.getUser.bind(userController));
Router.delete("/:id", userController.deleteUser.bind(userController));

export { Router as userRouter };