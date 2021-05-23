import { useRouter } from "next/router";
import Slider, { SliderTooltip } from "rc-slider";
import { useCallback, useState } from "react";

import Button from "../../components/button";
import useParticipant from "../../hooks/participant.hook";
import { Gender, Participant } from "../../types/participants";
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

const ExperimentLastPage = () => {
  const { mutate, participant } = useParticipant();
  const router = useRouter();

  const [age, setAge] = useState<number>(null);
  const [gender, setGender] = useState<string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [probabilityOne, setProbabilityOne] = useState<number>(null);
  const [probabilityTwo, setProbabilityTwo] = useState<number>(null);
  const [probabilityThree, setProbabilityThree] = useState<number>(null);
  const [riskLevel, setRiskLevel] = useState(1);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    const data = await fetcher.patch<{ participant: Participant }>(
      `/api/participants/current`,
      {
        body: JSON.stringify({
          age,
          gender,
          probabilityOne,
          probabilityThree,
          probabilityTwo,
          riskLevel,
        }),
      }
    );

    mutate(data);
    router.push("/experiment/thanks");
    setIsLoading(false);
  }, [
    age,
    gender,
    mutate,
    probabilityOne,
    probabilityTwo,
    probabilityThree,
    riskLevel,
    router,
  ]);

  const handleSlider = useCallback(
    (value: number) => {
      setRiskLevel(value);
    },
    [setRiskLevel]
  );

  if (!participant) {
    return <span>Loading...</span>;
  }

  const lastOutcome = participant.bets[participant.bets.length - 1].outcome;

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-12 text-center">
      <div>
        <span className="font-bold">
          Your last bet resulted in a{" "}
          <span className="lowercase">{lastOutcome}.</span> Your final balance
          is €{round(participant?.balance).toFixed(2)}.
        </span>
      </div>

      <div className="w-full border-t">
        <p>
          Please tell me, in general, how willing or unwilling you are to take
          risks, using a scale from 1 to 7, 1 being very <u>unwilling</u> to
          take risk & 7 being <u>very willing</u>
        </p>

        <div className="w-full">
          <Slider
            dots
            handle={handle}
            marks={{
              1: 1,
              2: 2,
              3: 3,
              4: 4,
              5: 5,
              6: 6,
              7: 7,
            }}
            max={7}
            min={1}
            onChange={handleSlider}
            step={1}
            value={riskLevel}
          />
        </div>
      </div>

      <div className="w-full border-t">
        <p>Are you a male or female? (optional)</p>

        <div className="space-x-2">
          <Button
            isActive={gender === Gender.MALE}
            onClick={() => setGender(Gender.MALE)}
          >
            Male
          </Button>
          <Button
            isActive={gender === Gender.FEMALE}
            onClick={() => setGender(Gender.FEMALE)}
          >
            Female
          </Button>
        </div>
      </div>

      <div className="w-full border-t">
        <p>What is your age?</p>

        <input
          className="px-4 py-2 border border-gray-400 rounded"
          onChange={(e) => setAge(parseInt(e.target.value))}
          type="number"
          value={age}
        />
      </div>

      <div className="w-full border-t">
        <p>
          Out of 1000 people in a small town 500 are member of a choir. Out of
          these 500 members in a choir 100 are men. Out of the 500 inhabitants
          that are not in a choir 300 are men. What is the probability that a
          randomly drawn man is a member of the choir? Please indicate the
          probability as a percentage (%).
        </p>

        <input
          className="px-4 py-2 border border-gray-400 rounded"
          onChange={(e) => setProbabilityOne(parseInt(e.target.value))}
          type="number"
          value={probabilityOne}
        />
      </div>

      <div className="w-full border-t">
        <p>
          Imagine we are throwing a loaded die (6 sides). The probability that
          the die shows a 6 is twice as high as the probability of each of the
          other numbers. On average, out of these 70 throws how many times would
          the die show the number 6?
        </p>

        <input
          className="px-4 py-2 border border-gray-400 rounded"
          onChange={(e) => setProbabilityTwo(parseInt(e.target.value))}
          type="number"
          value={probabilityTwo}
        />
      </div>

      <div className="w-full border-t">
        <p>
          In a forest, 20% of mushrooms are red, 50% brown and 30% white. A red
          mushroom is poisonous with a probability of 20%. A mushroom that is
          not red is poisonous with a probability of 5%. What is the probability
          that a poisonous mushroom in the forest is red?
        </p>

        <input
          className="px-4 py-2 border border-gray-400 rounded"
          onChange={(e) => setProbabilityThree(parseInt(e.target.value))}
          type="number"
          value={probabilityThree}
        />
      </div>

      <div className="w-full pt-8 border-t">
        <Button isLoading={isLoading} onClick={handleSubmit}>
          Submit your answers
        </Button>
      </div>
    </div>
  );
};

export default ExperimentLastPage;
