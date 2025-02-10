import * as express from 'express';
import { ParticipantController } from "../controller/participant.controller";
import { container } from 'tsyringe';
const router = express.Router();

const participantController = container.resolve(ParticipantController);

router.get("/:groupId/participants", participantController.getAllParticipantsInGroup.bind(participantController));
router.post("/:groupId/participants", participantController.addParticipantsToGroup.bind(participantController));
router.delete("/:groupId/participants/:userId", participantController.removeParticipantFromGroup.bind(participantController));

export { router as participantRouter };