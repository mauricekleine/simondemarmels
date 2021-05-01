import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { Experiment } from "../../models/experiment";
import fetcher from "../../utils/fetcher";
import "rc-slider/assets/index.css";
import Slider, { SliderTooltip } from "rc-slider";
import { Participant } from "../../models/participant";

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Slider.Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

const ExperimentPage = () => {
  const [amount, setAmount] = useState(0);
  const { data } = useSWR<{ experiment: Experiment }>(
    "/api/experiment",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const { data: pData, mutate } = useSWR<{ participant: Participant }>(
    "/api/participant",
    fetcher
  );

  const handleSlider = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );

  const handleSubmit = useCallback(async () => {
    const response = await fetch("/api/participant", {
      body: JSON.stringify({
        amount,
      }),
      credentials: "same-origin",
      headers: {
        ["Content-Type"]: "application/json",
      },
      method: "POST",
    });

    const participant = await response.json();

    mutate(participant);
    setAmount(0);
  }, [amount, data?.experiment.currentRound, mutate]);

  const hasSubmitted =
    pData?.participant?.bets.length === data?.experiment.currentRound;

  const hasFinished =
    data?.experiment.currentRound === 5 ||
    pData?.participant?.bets.length === 4;

  if (hasFinished) {
    return (
      <div className="flex flex-col h-screen items-center justify-center space-y-8 w-screen">
        <p>
          It's a wrap. Your participant ID is{" "}
          <span className="font-bold">{pData?.participant.pid}</span>. Thanks
          for participating!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center space-y-8 w-screen">
      {hasSubmitted ? (
        <p>Waiting for the host to start the next round</p>
      ) : (
        <>
          <p className="font-bold text-center text-lg">
            Round {data?.experiment?.currentRound}
          </p>

          {data?.experiment.currentRound === 4 && (
            <p>
              {pData?.participant?.group === "realization" ? (
                <span>
                  Your account has been settled. Your remaining balance is{" "}
                  {Math.round(pData.participant.balance * 100) / 100}.
                </span>
              ) : (
                <>
                  {pData?.participant?.balance > 20 && (
                    <span>
                      So far, you've earned{" "}
                      {Math.round((pData?.participant?.balance - 20) * 100) /
                        100}
                      .
                    </span>
                  )}

                  {pData?.participant?.balance < 20 && (
                    <span>
                      So far, you've lost{" "}
                      {Math.round((20 - pData?.participant?.balance) * 100) /
                        100}
                      .
                    </span>
                  )}

                  {pData?.participant?.balance === 20 && (
                    <span>So far, haven't earned or lost any mony.</span>
                  )}
                </>
              )}

              <span> Please make your last investment</span>
            </p>
          )}

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

          <p>Your bet: {amount}</p>

          <button
            className="border px-4 py-2 rounded hover:bg-gray-100"
            onClick={handleSubmit}
          >
            Place bet
          </button>
        </>
      )}
    </div>
  );
};

export default ExperimentPage;
