import * as express from 'express';
import { SettlementController } from "../controller/settlement.controller";
const router = express.Router();

router.get("/:groupId/settlements", SettlementController.getAllSettlementsFromGroup);
router.post("/:groupId/settlements", SettlementController.addOneSettlementToGroup);
router.delete("/:groupId/settlements/:id", SettlementController.removeSettlementFromGroup);

export { router as settlementRouter };