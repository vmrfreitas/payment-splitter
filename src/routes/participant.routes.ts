import * as express from 'express';
import { ParticipantController } from "../controller/participant.controller";
const router = express.Router();

// Add participants to a group
router.post("/groups/:groupId/participants", ParticipantController.addParticipants);

// Remove a participant (example)
router.delete("/groups/:groupId/participants/:userId", ParticipantController.removeParticipant);

export { router as participantRouter };