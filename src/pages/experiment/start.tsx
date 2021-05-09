import { useRouter } from "next/dist/client/router";
import { useCallback, useEffect } from "react";

import Button from "../../components/button";
import { Participant } from "../../types/participants";

const ExperimentStartPage = () => {
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("id");

    if (id) {
      router.replace("/experiment");
    }
  });

  const handleClick = useCallback(async () => {
    const response = await fetch("/api/participants", {
      headers: {
        ["Content-Type"]: "application/json",
      },
      method: "POST",
    });

    const data = (await response.json()) as {
      participant: Participant;
    };

    localStorage.setItem("id", data.participant._id);
    router.replace("/experiment");
  }, [router]);

  return (
    <div>
      <h1>Welcome!</h1>

      <p>
        You have just been credited €20 worth of tokens to play this investment
        game. You will make 4 rounds of investment decisions. In each round you
        have the option to invest up to €5 tokens. To indicate the amount you
        want to invest, simply drag the indicator across the line or click on a
        number. You can invest in increments of €0.01.
      </p>

      <p>
        In each round, a dice will be thrown to determine whether your
        investment is a win or a loss. Therefore, the probability of winning is
        1/6, or 16.7%, in every round. For each win, your investment will be
        multiplied by 7. For a loss, you will simply lose the portion of 5
        tokens you invested.
      </p>

      <p className="italic">For example:</p>

      <p>
        If you bet €2 and win, your winnings will equal €14. You will also have
        the balance you did not invest (€18). So, your account balance after
        round 1 would be: €18 + €14 = €32
      </p>

      <p>
        If you bet €2 and lose, you will lose the €2 but still have the
        remaining balance from what you did not invest (€18). So, your account
        balance after round 1 would be: €20 – €2 = €18
      </p>

      <p>
        At the end, you will see your balance and answer a question. Simply
        indicate the answer by clicking the appropriate button.
      </p>

      <Button onClick={handleClick}>Start experiment</Button>
    </div>
  );
};

export default ExperimentStartPage;
