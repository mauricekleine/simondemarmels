import { Document, Model, Schema, model, models } from "mongoose";

import {
  BetOutcome,
  Gender,
  Participant,
  ParticipantGroup,
} from "../types/participants";

import "../utils/init-db";

interface ParticipantDocument extends Participant, Document {
  _id: string;
}

const betSchema = new Schema({
  amount: { default: 0, required: true, type: Number },
  outcome: {
    default: BetOutcome.LOSS,
    enum: BetOutcome,
    required: true,
    type: String,
  },
});

const questionsSchema = new Schema({
  age: { type: Number },
  gender: { enum: Gender, type: String },
  probabilityOne: { type: Number },
  probabilityThree: { type: Number },
  probabilityTwo: { type: Number },
  riskLevel: { type: Number },
});

const participantSchema = new Schema({
  balance: { default: 20, required: true, type: Number },
  bets: [betSchema],
  group: {
    default: ParticipantGroup.PAPER,
    enum: ParticipantGroup,
    required: true,
    type: String,
  },
  questions: questionsSchema,
});

const ParticipantModel: Model<ParticipantDocument> =
  models.Participant || model("Participant", participantSchema);

export default ParticipantModel;
