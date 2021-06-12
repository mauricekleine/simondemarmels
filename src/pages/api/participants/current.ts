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

  if (!id) {
    res.status(400).end();
    return;
  }

  const participant = await ParticipantModel.findById(id);

  if (req.method === "GET") {
    res.status(200).json({ participant });
    return;
  }

  const {
    age,
    amount,
    gender,
    probabilityOne,
    probabilityThree,
    probabilityTwo,
    riskLevel,
    strategy,
  } = req.body;

  if (amount) {
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
  }

  if (!participant.questions) {
    participant.questions = {};
  }

  if (age) {
    participant.questions.age = age;
  }

  if (gender) {
    participant.questions.gender = gender;
  }

  if (probabilityOne) {
    participant.questions.probabilityOne = probabilityOne;
  }

  if (probabilityTwo) {
    participant.questions.probabilityTwo = probabilityTwo;
  }

  if (probabilityThree) {
    participant.questions.probabilityThree = probabilityThree;
  }

  if (riskLevel) {
    participant.questions.riskLevel = riskLevel;
  }

  if (strategy) {
    participant.strategy = strategy;
  }

  const result = await participant.save();
  res.status(200).json({ participant: result });
  return;
};

export default handler;
