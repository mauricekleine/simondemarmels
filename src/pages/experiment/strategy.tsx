import Slider, { SliderTooltip } from "rc-slider";
import { useCallback, useState } from "react";

import Button from "../../components/button";
import useParticipant from "../../hooks/participant.hook";
import { Participant } from "../../types/participants";
import fetcher from "../../utils/fetcher";

import "rc-slider/assets/index.css";

const betsInit = {
  roundOneBet: 0,
  roundTwoBetLoss: 0,
  roundTwoBetWin: 0,
  // eslint-disable-next-line sort-keys
  roundThreeBetLoss: 0,
  roundThreeBetWin: 0,
  // eslint-disable-next-line sort-keys
  roundFourBetLoss: 0,
  roundFourBetWin: 0,
};

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

const BetSlider = ({
  betKey,
  handleSlider,
  value,
}: {
  betKey: string;
  handleSlider: (key, value) => void;
  value: number;
}) => (
  <div className="text-center">
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
        onChange={(val) => handleSlider(betKey, val)}
        step={0.01}
        value={value}
      />
    </div>

    <p>Your bet: €{value.toFixed(2)}</p>
  </div>
);

const StrategyPage = () => {
  const { mutate, participant } = useParticipant();

  const [bets, setBets] = useState(betsInit);
  const [isLoading, setIsLoading] = useState(false);

  const handleSlider = useCallback(
    (key: string, value: number) => {
      setBets({ ...bets, [key]: value });
    },
    [bets, setBets]
  );

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetcher.patch<{
        participant: Participant;
      }>(`/api/participants/current`, {
        body: JSON.stringify({
          strategy: bets,
        }),
      });

      mutate(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }, [bets, mutate]);

  if (!participant) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="space-x-1">
        <p>
          Before you begin playing the game, please enter your planned
          investment strategy on the sliders below. For example, you will see
          sliders asking you what you plan to invest in each round given the
          previous round was either a win or a loss.
        </p>

        <p>
          Simply indicate your planned investment for each case on each of the
          seven sliders below by dragging the dot across the bar or clicking on
          a number. After you are done, you can proceed onward and make your
          actual investments in the game.
        </p>
      </div>

      <div className="w-full">
        <p className="text-lg font-bold">Round one</p>

        <BetSlider
          betKey="roundOneBet"
          handleSlider={handleSlider}
          value={bets.roundOneBet}
        />
      </div>

      <div className="w-full">
        <p className="text-lg font-bold">Round two</p>

        <p>In case round one was a loss </p>
        <BetSlider
          betKey="roundTwoBetLoss"
          handleSlider={handleSlider}
          value={bets.roundTwoBetLoss}
        />

        <p>In case round one was a win </p>
        <BetSlider
          betKey="roundTwoBetWin"
          handleSlider={handleSlider}
          value={bets.roundTwoBetWin}
        />
      </div>

      <div className="w-full">
        <p className="text-lg font-bold">Round three</p>

        <p>In case round two was a loss </p>
        <BetSlider
          betKey="roundThreeBetLoss"
          handleSlider={handleSlider}
          value={bets.roundThreeBetLoss}
        />

        <p>In case round two was a win </p>
        <BetSlider
          betKey="roundThreeBetWin"
          handleSlider={handleSlider}
          value={bets.roundThreeBetWin}
        />
      </div>

      <div className="w-full">
        <p className="text-lg font-bold">Round four</p>

        <p>In case round three was a loss </p>
        <BetSlider
          betKey="roundFourBetLoss"
          handleSlider={handleSlider}
          value={bets.roundFourBetLoss}
        />

        <p>In case round three was a win </p>
        <BetSlider
          betKey="roundFourBetWin"
          handleSlider={handleSlider}
          value={bets.roundFourBetWin}
        />
      </div>

      <div className="w-full pt-4 text-center border-t-2">
        <Button isLoading={isLoading} onClick={handleSubmit}>
          Submit strategy
        </Button>
      </div>
    </div>
  );
};

export default StrategyPage;
