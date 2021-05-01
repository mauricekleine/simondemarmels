import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import ExperimentModel from "../../../models/experiment";
import ParticipantModel from "../../../models/participant";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const experiment = await ExperimentModel.findOne();

  res.status(200).json({ experiment });
});

handler.post(async (req, res) => {
  const { outcome } = req.body;

  const experiment = await ExperimentModel.findOne();
  const participants = await ParticipantModel.find();

  const promises = participants.map((participant) => {
    const currentRoundsBet = participant.bets.find(
      (bet) => bet.round === experiment.currentRound
    );

    if (!currentRoundsBet) {
      participant.bets.push({
        amount: -1,
        round: experiment.currentRound,
      });
    } else {
      if (outcome === "loss") {
        participant.balance =
          Math.round((participant.balance - currentRoundsBet.amount) * 100) /
          100;
      } else if (outcome === "win") {
        participant.balance =
          Math.round(
            (participant.balance + currentRoundsBet.amount * 7) * 100
          ) / 100;
      }
    }

    return participant.save();
  });

  await Promise.allSettled(promises);

  experiment.currentRound =
    experiment.currentRound === 5 ? 5 : experiment.currentRound + 1;

  const result = await experiment.save();

  res.status(200).json({ experiment: result });
});

// ExperimentModel.create({ currentRound: 1 });

export default handler;
