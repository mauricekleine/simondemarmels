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
      await fetch("/api/participants", {
        credentials: "same-origin",
        headers: {
          ["Content-Type"]: "application/json",
        },
        method: "DELETE",
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
            <th className="w-1/12 text-xs text-left">Participant</th>
            <th className="w-1/12 text-xs text-left">Group</th>
            <th className="w-1/12 text-xs text-left">Risk averse?</th>
            <th className="w-1/12 text-xs text-left">Round #1</th>
            <th className="w-1/12 text-xs text-left">Round #2</th>
            <th className="w-1/12 text-xs text-left">Round #3</th>
            <th className="w-1/12 text-xs text-left">Round #4</th>
            <th className="w-1/12 text-xs text-left">Balance</th>
          </tr>
        </thead>

        <tbody>
          {data?.participants.map((participant, index) => (
            <tr key={participant._id}>
              <td className="text-xs">{index}</td>
              <td className="text-xs">{participant.group}</td>
              <td className="text-xs">
                {participant.isRiskAverse ? "Yes" : "No"}
              </td>
              <td className="text-xs">
                {participant.bets[0]?.amount.toFixed(2)}
              </td>
              <td className="text-xs">
                {participant.bets[1]?.amount.toFixed(2)}
              </td>
              <td className="text-xs">
                {participant.bets[2]?.amount.toFixed(2)}
              </td>
              <td className="text-xs">
                {participant.bets[3]?.amount.toFixed(2)}
              </td>
              <td className="text-xs">{participant.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExperimentAdminPage;
