import * as express from 'express';
import { UserController } from '../controller/user.controller';
const Router = express.Router();

Router.get("/", UserController.getAllUsers);
Router.post("/", UserController.createUser);
Router.get("/:id", UserController.getUser);
Router.delete("/:id", UserController.deleteUser);

export { Router as userRouter };