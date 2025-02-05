import { AppDataSource } from "../data-source";
import { Participant } from "../entity/Participant.entity";

export const ParticipantRepository = AppDataSource.getRepository(Participant);