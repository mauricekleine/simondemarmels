import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import ExperimentModel from "../../../models/experiment";
import ParticipantModel from "../../../models/participant";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const experiment = await ExperimentModel.updateOne({
    currentRound: 1,
  });
  const participants = await ParticipantModel.deleteMany();

  res.status(200).json({ experiment: experiment, participants: [] });
});

export default handler;
