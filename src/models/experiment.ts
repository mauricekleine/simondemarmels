import { Document, Model, Schema, model, models } from "mongoose";
import "../utils/init-db";

export type Experiment = {
  currentRound: number;
};

interface ExperimentDocument extends Document<Experiment>, Experiment {}

const experimentSchema = new Schema({
  currentRound: { default: 1, required: true, type: Number },
});

const ExperimentModel: Model<ExperimentDocument> =
  models.Experiment || model("Experiment", experimentSchema);

export default ExperimentModel;
