import { useRouter } from "next/dist/client/router";
import Slider, { SliderTooltip } from "rc-slider";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import Button from "../../components/button";
import { Participant, ParticipantGroup } from "../../types/participants";
import fetcher from "../../utils/fetcher";
import { round } from "../../utils/math";

import "rc-slider/assets/index.css";

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={value.toFixed(2)}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Slider.Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

const ExperimentPage = () => {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");

    if (id) {
      setId(id);
    } else {
      router.replace("/experiment/start");
    }
  }, [router, setId]);

  const { data, mutate } = useSWR<{ participant: Participant }>(
    id ? `/api/participants/${id}` : null,
    fetcher
  );

  const participant = id && data?.participant;

  useEffect(() => {
    if (!participant) {
      return;
    }

    if (participant?.bets.length === 4) {
      router.push("/experiment/last");
    }
  }, [participant, router]);

  const handleSlider = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );

  const handleSubmit = useCallback(async () => {
    const response = await fetch(`/api/participants/${id}`, {
      body: JSON.stringify({
        amount,
      }),
      headers: {
        ["Content-Type"]: "application/json",
      },
      method: "PATCH",
    });

    const data = (await response.json()) as {
      participant: Participant;
    };

    localStorage.setItem("id", data.participant._id);
    mutate(data);
    setAmount(0);
    setHasSubmitted(true);
    setId(data.participant._id);
  }, [amount, id, mutate]);

  if (hasSubmitted) {
    const isRealizationGroup =
      participant?.group === ParticipantGroup.REALIZATION;
    const isThirdBet = participant?.bets.length === 3;
    const lastOutcome = participant?.bets[participant?.bets.length - 1].outcome;

    return (
      <div className="flex flex-col items-center justify-center w-full h-screen text-center">
        <p>
          Your last bet resulted in a{" "}
          <span className="lowercase">{lastOutcome}.</span>
        </p>

        {isThirdBet && !isRealizationGroup && (
          <p>
            Your account has been settled. Your remaining balance is €
            {round(data.participant.balance).toFixed(2)}.
          </p>
        )}

        {isThirdBet && isRealizationGroup && (
          <>
            <p>
              {participant?.balance > 20 && (
                <span>
                  So far, you&apos;ve earned €
                  {round(participant?.balance - 20).toFixed(2)}.
                </span>
              )}

              {participant?.balance < 20 && (
                <span>
                  So far, you&apos;ve lost €
                  {round(20 - participant?.balance).toFixed(2)}.
                </span>
              )}

              {participant?.balance === 20 && (
                <span>So far, you haven&apos;t earned or lost any money.</span>
              )}
            </p>

            <p>
              To finalise your position up to this point, please click
              “Transfer” below. You will then move on to the last round.
            </p>
          </>
        )}

        <Button onClick={() => setHasSubmitted(false)}>
          {isThirdBet && isRealizationGroup ? "Transfer" : "Continue"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-8">
      <p className="text-lg font-bold text-center">
        Round {participant?.bets.length + 1}
      </p>

      <div className="w-full">
        <Slider
          dots
          handle={handle}
          marks={{
            0: 0,
            0.5: 0.5,
            1: 1,
            1.5: 1.5,
            2: 2,
            2.5: 2.5,
            3: 3,
            3.5: 3.5,
            4: 4,
            4.5: 4.5,
            5: 5,
          }}
          max={5}
          min={0}
          onChange={handleSlider}
          step={0.01}
          value={amount}
        />
      </div>

      <p>Your bet: €{amount.toFixed(2)}</p>

      <Button onClick={handleSubmit}>Place bet</Button>
    </div>
  );
};

export default ExperimentPage;
