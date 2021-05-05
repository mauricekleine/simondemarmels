import { NextApiRequest, NextApiResponse } from "next";

import ParticipantModel from "../../../models/participant";
import {
  BetOutcome,
  Participant,
  ParticipantGroup,
} from "../../../types/participants";
import { round } from "../../../utils/math";

const ALLOWED_METHODS = ["DELETE", "GET", "POST"];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    res.setHeader("Allow", ALLOWED_METHODS);
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (req.method === "DELETE") {
    await ParticipantModel.deleteMany();

    res.status(200).json({ participants: [] });
    return;
  }

  if (req.method === "GET") {
    const participants = await ParticipantModel.find();

    res.status(200).json({ participants });
    return;
  }

  const { amount } = req.body;
  const outcome = Math.random() < 1 / 6 ? BetOutcome.WIN : BetOutcome.LOSS;

  const balance =
    outcome === BetOutcome.LOSS ? round(20 - amount) : round(20 + amount * 7);

  const group =
    Math.random() < 0.5 ? ParticipantGroup.PAPER : ParticipantGroup.REALIZATION;

  const participant: Omit<Participant, "_id"> = {
    balance,
    bets: [
      {
        amount,
        outcome,
      },
    ],
    group,
  };

  const result = await ParticipantModel.create(participant);

  res.status(200).json({ participant: result });
};

export default handler;
