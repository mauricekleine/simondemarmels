import { useCallback, useState } from "react";

import Button from "../components/button";
import useParticipant from "../hooks/participant.hook";
import { Participant } from "../types/participants";
import fetcher from "../utils/fetcher";

const HomePage = () => {
  const { mutate } = useParticipant();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetcher.post<{
        participant: Participant;
      }>("/api/participants");

      localStorage.setItem("id", data.participant._id);
      mutate(data);
    } catch (err) {
      setIsLoading(false);
    }
  }, [mutate]);

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
        multiplied by 7. For a loss, you will simply lose the amount you chose
        to invest.
      </p>

      <p className="italic">
        Here are 4 different examples for clarity regarding the math:
      </p>

      <p>
        If you bet €2 and win, your winnings will equal €14. You will also have
        the balance you did not invest (€18). So, your account balance after
        round 1 would be: €18 + €14 = €32
      </p>

      <p>
        If you invest €2 and are unsuccessful, you will lose the €2 but still
        have the remaining balance from what you did not invest (€18). So, your
        account balance after round 1 would be: €20 – €2 = €18
      </p>

      <p>
        If you invest €4 and are successful, your earnings will equal €28. You
        will also have the balance you did not invest (€16). So, your account
        balance after round 1 would be: €16 + €28 = €44
      </p>

      <p>
        If you invest €4 and are unsuccessful, you will lose the €4 but still
        have the remaining balance from what you did not invest (€16). So, your
        account balance after round 1 would be: €20 – €4 = €16
      </p>

      <Button isLoading={isLoading} onClick={handleClick}>
        Start experiment
      </Button>
    </div>
  );
};

export default HomePage;
