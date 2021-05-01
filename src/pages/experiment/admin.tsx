import { useCallback } from "react";
import useSWR from "swr";
import { Experiment } from "../../models/experiment";
import { Participant } from "../../models/participant";
import fetcher from "../../utils/fetcher";

const ExperimentAdminPage = () => {
  const { data, mutate } = useSWR<{ participants: Participant[] }>(
    "/api/participants",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const { data: eData } = useSWR<{ experiment: Experiment }>(
    "/api/experiment",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const handleSubmit = (outcome: "loss" | "win") => {
    fetch("/api/experiment", {
      body: JSON.stringify({
        outcome,
      }),
      credentials: "same-origin",
      headers: {
        ["Content-Type"]: "application/json",
      },
      method: "POST",
    });
  };

  const handleReset = async () => {
    const isConfirmed = confirm("Are you sure? This cannot be undone.");

    if (isConfirmed) {
      await fetch("/api/experiment/reset", {
        credentials: "same-origin",
        headers: {
          ["Content-Type"]: "application/json",
        },
        method: "POST",
      });

      mutate();
    }
  };

  return (
    <div className="p-8">
      <p>Current round #{eData?.experiment?.currentRound}</p>

      <div className="flex mb-4 space-x-2">
        <button
          className="bg-green-400 border px-4 py-2 rounded text-white hover:bg-green-300"
          onClick={() => handleSubmit("win")}
        >
          It's a win
        </button>

        <button
          className="bg-red-400 border px-4 py-2 rounded text-white hover:bg-red-300"
          onClick={() => handleSubmit("loss")}
        >
          It's a loss
        </button>

        <button
          className="bg-gray-400 border px-4 py-2 rounded text-white hover:bg-gray-300"
          onClick={() => handleReset()}
        >
          Reset
        </button>
      </div>

      {data?.participants ? (
        <table className="table-fixed">
          <thead>
            <tr>
              <th className="text-left w-2/12">Participant</th>
              <th className="text-left w-1/12">Group</th>
              <th className="text-left w-1/12">Round #1</th>
              <th className="text-left w-1/12">Round #2</th>
              <th className="text-left w-1/12">Round #3</th>
              <th className="text-left w-1/12">Round #4</th>
              <th className="text-left w-1/12">Balance</th>
            </tr>
          </thead>

          <tbody>
            {data?.participants.map((participant) => {
              const roundOne = participant.bets.find((b) => b.round === 1);
              const roundTwo = participant.bets.find((b) => b.round === 2);
              const roundThree = participant.bets.find((b) => b.round === 3);
              const roundFour = participant.bets.find((b) => b.round === 4);

              return (
                <tr key={participant.pid}>
                  <td>{participant.pid}</td>
                  <td>{participant.group}</td>
                  <td>{roundOne?.amount}</td>
                  <td>{roundTwo?.amount}</td>
                  <td>{roundThree?.amount}</td>
                  <td>{roundFour?.amount}</td>
                  <td>{participant.balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default ExperimentAdminPage;
