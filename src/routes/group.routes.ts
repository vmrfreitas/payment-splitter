import * as express from 'express';
import { GroupController } from '../controller/group.controller';
const Router = express.Router();

Router.get("/", GroupController.getGroups);
Router.post("/", GroupController.createGroup);

export { Router as groupRouter };