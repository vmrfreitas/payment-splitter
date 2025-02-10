import * as express from 'express';
import { GroupController } from '../controller/group.controller';
import { container } from 'tsyringe';

const Router = express.Router();
const groupController = container.resolve(GroupController);

Router.get("/", groupController.getAllGroups.bind(groupController));
Router.get("/:id", groupController.getGroup.bind(groupController));
Router.delete("/:id", groupController.removeGroup.bind(groupController));
Router.patch("/:id", groupController.updateGroupName.bind(groupController));
Router.post("/", groupController.createGroup.bind(groupController));
Router.get("/:id/transactions", groupController.getTransactionHistory.bind(groupController));

export { Router as groupRouter };