import * as express from 'express';
import { ParticipantController } from "../controller/participant.controller";
const router = express.Router();

router.get("/:groupId/participants", ParticipantController.getAllParticipants);
router.post("/:groupId/participants", ParticipantController.addParticipants);
router.delete("/:groupId/participants/:userId", ParticipantController.removeParticipant);

export { router as participantRouter };