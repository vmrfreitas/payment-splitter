import * as express from 'express';
import { ParticipantController } from "../controller/participant.controller";
const router = express.Router();

router.get("/:groupId/participants", ParticipantController.getAllParticipantsInGroup);
router.post("/:groupId/participants", ParticipantController.addParticipantsToGroup);
router.delete("/:groupId/participants/:userId", ParticipantController.removeParticipantFromGroup);

export { router as participantRouter };