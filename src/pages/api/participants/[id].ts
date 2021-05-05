import { NextApiRequest, NextApiResponse } from "next";

import ParticipantModel from "../../../models/participant";
import { BetOutcome } from "../../../types/participants";
import { round } from "../../../utils/math";

const ALLOWED_METHODS = ["GET", "PATCH"];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    res.setHeader("Allow", ALLOWED_METHODS);
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { id } = req.query as { id: string };
  const participant = await ParticipantModel.findById(id);

  if (req.method === "GET") {
    res.status(200).json({ participant });
    return;
  }

  const { amount } = req.body;
  const outcome = Math.random() < 1 / 6 ? BetOutcome.WIN : BetOutcome.LOSS;

  participant.bets.push({
    amount,
    outcome,
  });

  if (outcome === BetOutcome.LOSS) {
    participant.balance = round(participant.balance - amount);
  } else {
    participant.balance = round(participant.balance + amount * 7);
  }

  const result = await participant.save();
  res.status(200).json({ participant: result });
  return;
};

export default handler;
