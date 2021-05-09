import { useRouter } from "next/dist/client/router";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import Button from "../../components/button";
import { Participant } from "../../types/participants";
import fetcher from "../../utils/fetcher";
import { round } from "../../utils/math";

const ExperimentLastPage = () => {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [hasSubmittedRiskPreference, setHasSubmittedRiskPreference] = useState(
    false
  );

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

    if (participant?.bets.length !== 4) {
      router.push("/experiment");
    }
  }, [participant, router]);

  const handleRiskPreference = useCallback(
    async (isRiskAverse?: boolean) => {
      const response = await fetch(`/api/participants/${id}`, {
        body: JSON.stringify({
          isRiskAverse,
        }),
        headers: {
          ["Content-Type"]: "application/json",
        },
        method: "PATCH",
      });

      const data = (await response.json()) as {
        participant: Participant;
      };

      mutate(data);
      setHasSubmittedRiskPreference(true);
    },
    [id, mutate]
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-8 text-center">
      {!hasSubmittedRiskPreference ? (
        <>
          <p>
            Your final balance is €{round(participant?.balance).toFixed(2)}.
          </p>

          <p>
            How do you see yourself: Are you a person who is generally willing
            to take risks, or do you try to avoid taking risks?
          </p>

          <div className="flex space-x-2">
            <Button onClick={() => handleRiskPreference(true)}>
              I like risks
            </Button>

            <Button onClick={() => handleRiskPreference(false)}>
              I generally avoid risks
            </Button>
          </div>
        </>
      ) : (
        <p>It&apos;s a wrap! Your answers have been submitted. Thanks!</p>
      )}
    </div>
  );
};

export default ExperimentLastPage;
