import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import session, { Session } from "express-session";
import MongoStore from "connect-mongo";
import ParticipantModel, { Participant } from "../../models/participant";
import ExperimentModel from "../../models/experiment";

type ExtendedNextApiRequest = {
  session: Session;
};

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

handler.get<ExtendedNextApiRequest>(async (req, res) => {
  const { id: pid } = req.session;
  const participant = await ParticipantModel.findOne({ pid });

  res.status(200).json({ participant });
});

handler.post<ExtendedNextApiRequest>(async (req, res) => {
  const { amount } = req.body;
  const { id: pid } = req.session;

  const experiment = await ExperimentModel.findOne();
  const participant = await ParticipantModel.findOne({ pid });

  let result;

  if (participant) {
    participant.bets.push({
      amount,
      round: experiment.currentRound,
    });

    result = await participant.save();
  } else {
    const bets = [];

    if (experiment.currentRound === 1) {
      bets.push({
        amount,
        round: experiment.currentRound,
      });
    } else if (experiment.currentRound === 2) {
      bets.push(
        { amount: -1, round: experiment.currentRound - 1 },
        {
          amount,
          round: experiment.currentRound,
        }
      );
    } else if (experiment.currentRound === 3) {
      bets.push(
        { amount: -1, round: experiment.currentRound - 2 },
        { amount: -1, round: experiment.currentRound - 1 },
        {
          amount,
          round: experiment.currentRound,
        }
      );
    } else if (experiment.currentRound === 4) {
      bets.push(
        { amount: -1, round: experiment.currentRound - 3 },
        { amount: -1, round: experiment.currentRound - 2 },
        { amount: -1, round: experiment.currentRound - 1 },
        {
          amount,
          round: experiment.currentRound,
        }
      );
    }

    const participant: Participant = {
      balance: 20,
      bets,
      group: Math.random() < 0.5 ? "paper" : "realization",
      pid,
    };

    result = await ParticipantModel.create(participant);
  }

  res.status(200).json({ participant: result });
});

export default handler;
