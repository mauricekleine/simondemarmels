export enum BetOutcome {
  LOSS = "LOSS",
  WIN = "WIN",
}

export type Bet = {
  amount: number;
  outcome: BetOutcome;
};

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
};
