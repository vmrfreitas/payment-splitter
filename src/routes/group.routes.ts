import * as express from 'express';
import { GroupController } from '../controller/group.controller';
const Router = express.Router();

Router.get("/", GroupController.getAllGroups);
Router.get("/:id", GroupController.getGroup);
Router.patch("/:id", GroupController.updateGroupName);
Router.post("/", GroupController.createGroup);
Router.post("/:id/participants", GroupController.addParticipants);

export { Router as groupRouter };