import * as express from 'express';
import { GroupController } from '../controller/group.controller';
const Router = express.Router();

Router.get("/", GroupController.getAllGroups);
Router.get("/:id", GroupController.getGroup);
Router.delete("/:id", GroupController.removeGroup);
Router.patch("/:id", GroupController.updateGroupName);
Router.post("/", GroupController.createGroup);
Router.get("/:id/transactions", GroupController.getTransactionHistory);

export { Router as groupRouter };