import Slider, { SliderTooltip } from "rc-slider";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

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
  const [id, setId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");

    if (id) {
      setId(id);
    }
  }, [setId]);

  const { data, mutate } = useSWR<{ participant: Participant }>(
    id ? `/api/participants/${id}` : null,
    fetcher
  );

  const handleSlider = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );

  const handleSubmit = useCallback(async () => {
    const url = id ? `/api/participants/${id}` : "/api/participants";
    const method = id ? "PATCH" : "POST";

    const response = await fetch(url, {
      body: JSON.stringify({
        amount,
      }),
      headers: {
        ["Content-Type"]: "application/json",
      },
      method,
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

  const participant = id && data?.participant;
  const hasFinished = participant?.bets.length === 4;

  if (hasFinished) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen space-y-8">
        <p>
          It&apos;s a wrap. Your participant ID is{" "}
          <span className="font-bold">{participant?._id}</span>. Thanks for
          participating!
        </p>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen space-y-8">
        <p>
          Your last bet resulted in a{" "}
          <span className="lowercase">
            {participant?.bets[participant?.bets.length - 1].outcome}
          </span>
        </p>

        {participant?.bets.length === 3 && (
          <div className="text-center">
            {participant?.group === ParticipantGroup.REALIZATION ? (
              <span>
                Your account has been settled. Your remaining balance is{" "}
                {round(data.participant.balance).toFixed(2)}.
              </span>
            ) : (
              <>
                <p>
                  {participant?.balance > 20 && (
                    <span>
                      So far, you&apos;ve earned{" "}
                      {round(participant?.balance - 20).toFixed(2)}.
                    </span>
                  )}

                  {participant?.balance < 20 && (
                    <span>
                      So far, you&apos;ve lost{" "}
                      {round(20 - participant?.balance).toFixed(2)}.
                    </span>
                  )}

                  {participant?.balance === 20 && (
                    <span>
                      So far, you haven&apos;t earned or lost any money.
                    </span>
                  )}
                </p>

                <p>
                  To finalise your position up to this point, please click
                  “Transfer” below. You will then move on to the last round
                </p>
              </>
            )}
          </div>
        )}

        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={() => setHasSubmitted(false)}
        >
          {participant?.bets.length === 3 &&
          participant?.group === ParticipantGroup.PAPER
            ? "Transfer"
            : "Continue"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen space-y-8">
      <>
        <p className="text-lg font-bold text-center">
          Round {participant ? participant.bets.length + 1 : 1}
        </p>

        <div className="w-6/12">
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

        <p>Your bet: {amount.toFixed(2)}</p>

        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={handleSubmit}
        >
          Place bet
        </button>
      </>
    </div>
  );
};

export default ExperimentPage;
