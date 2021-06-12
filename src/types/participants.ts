export enum BetOutcome {
  LOSS = "LOSS",
  WIN = "WIN",
}

export type Bet = {
  amount: number;
  outcome: BetOutcome;
};

export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

export enum ParticipantGroup {
  PAPER = "PAPER",
  REALIZATION = "REALIZATION",
}

export type Participant = {
  _id: string;
  balance: number;
  bets: Bet[];
  group: ParticipantGroup;
  isRiskAverse?: boolean;
  questions: {
    age?: number;
    gender?: Gender;
    probabilityOne?: number;
    probabilityThree?: number;
    probabilityTwo?: number;
    riskLevel?: number;
  };
  strategy: {
    roundFourBetLoss: number;
    roundFourBetWin: number;
    roundOneBet: number;
    roundThreeBetLoss: number;
    roundThreeBetWin: number;
    roundTwoBetLoss: number;
    roundTwoBetWin: number;
  };
};
