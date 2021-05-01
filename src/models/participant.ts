import { Document, Model, Schema, model, models } from "mongoose";
import "../utils/init-db";

export type Bet = {
  amount: number;
  round: number;
};

export type Participant = {
  balance: number;
  bets: Bet[];
  group: "paper" | "realization";
  pid: string;
};

interface ParticipantDocument extends Document<Participant>, Participant {
  id: string;
}

const betSchema = new Schema({
  amount: { default: 0, required: true, type: Number },
  round: { default: 1, required: true, type: Number },
});

const participantSchema = new Schema({
  balance: { default: 20, required: true, type: Number },
  bets: [betSchema],
  group: { default: "paper", required: true, type: String },
  pid: { required: true, type: String },
});

const ParticipantModel: Model<ParticipantDocument> =
  models.Participant || model("Participant", participantSchema);

export default ParticipantModel;
