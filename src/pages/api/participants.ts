import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import session, { Session } from "express-session";
import MongoStore from "connect-mongo";
import ParticipantModel from "../../models/participant";

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

handler.get(async (req, res) => {
  const participants = await ParticipantModel.find();

  res.status(200).json({ participants });
});

export default handler;
