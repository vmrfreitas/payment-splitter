import * as express from 'express';
import { SettlementController } from "../controller/settlement.controller";
import { container } from 'tsyringe';
const router = express.Router();

const settlementController = container.resolve(SettlementController);

router.get("/:groupId/settlements", settlementController.getAllSettlementsFromGroup.bind(settlementController));
router.post("/:groupId/settlements", settlementController.addOneSettlementToGroup.bind(settlementController));
router.delete("/:groupId/settlements/:id", settlementController.removeSettlementFromGroup.bind(settlementController));

export { router as settlementRouter };