import useSWR from "swr";

import { Participant } from "../../types/participants";
import fetcher from "../../utils/fetcher";

const ExperimentAdminPage = () => {
  const { data, mutate } = useSWR<{ participants: Participant[] }>(
    "/api/participants",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

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

  if (!data?.participants) {
    return <span>Loading...</span>;
  }

  return (
    <div className="py-8">
      <div className="flex mb-4 space-x-2">
        <button
          className="px-4 py-2 text-white bg-gray-400 border rounded hover:bg-gray-300"
          onClick={() => handleReset()}
        >
          Reset
        </button>
      </div>

      <table className="table-fixed">
        <thead>
          <tr>
            <th className="w-2/12 text-left">Participant</th>
            <th className="w-1/12 text-left">Group</th>
            <th className="w-1/12 text-left">Risk averse?</th>
            <th className="w-1/12 text-left">Round #1</th>
            <th className="w-1/12 text-left">Round #2</th>
            <th className="w-1/12 text-left">Round #3</th>
            <th className="w-1/12 text-left">Round #4</th>
            <th className="w-1/12 text-left">Balance</th>
          </tr>
        </thead>

        <tbody>
          {data?.participants.map((participant) => (
            <tr key={participant._id}>
              <td>{participant._id}</td>
              <td>{participant.group}</td>
              <td>{participant.isRiskAverse ? "Yes" : "No"}</td>
              <td>{participant.bets[0]?.amount.toFixed(2)}</td>
              <td>{participant.bets[1]?.amount.toFixed(2)}</td>
              <td>{participant.bets[2]?.amount.toFixed(2)}</td>
              <td>{participant.bets[3]?.amount.toFixed(2)}</td>
              <td>{participant.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExperimentAdminPage;
