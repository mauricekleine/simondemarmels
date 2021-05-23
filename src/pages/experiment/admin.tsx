import useSWR from "swr";

import { Participant } from "../../types/participants";
import fetcher from "../../utils/fetcher";

const ExperimentAdminPage = () => {
  const { data, mutate } = useSWR<{ participants: Participant[] }>(
    "/api/participants",
    fetcher.get,
    {
      refreshInterval: 2000,
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
    <div className="w-screen py-8 mx-8">
      <div className="flex mb-4 space-x-2">
        <button
          className="px-4 py-2 text-white bg-gray-400 border rounded hover:bg-gray-300"
          onClick={() => handleReset()}
        >
          Reset
        </button>
      </div>

      <table className="text-xs table-fixed">
        <thead>
          <tr>
            <th>Participant</th>
            <th>Group</th>
            <th>Round #1</th>
            <th></th>
            <th>Round #2</th>
            <th></th>
            <th>Round #3</th>
            <th></th>
            <th>Round #4</th>
            <th></th>
            <th>Balance</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Risk level</th>
            <th>Question #1</th>
            <th>Question #2</th>
            <th>Question #3</th>
          </tr>
        </thead>

        <tbody>
          {data?.participants.map((participant, index) => (
            <tr key={participant._id}>
              <td>{index}</td>
              <td>{participant.group}</td>
              <td>{participant.bets[0]?.amount.toFixed(2)}</td>
              <td>{participant.bets[0]?.outcome}</td>
              <td>{participant.bets[1]?.amount.toFixed(2)}</td>
              <td>{participant.bets[1]?.outcome}</td>
              <td>{participant.bets[2]?.amount.toFixed(2)}</td>
              <td>{participant.bets[2]?.outcome}</td>
              <td>{participant.bets[3]?.amount.toFixed(2)}</td>
              <td>{participant.bets[3]?.outcome}</td>
              <td>{participant.balance.toFixed(2)}</td>
              <td>{participant.questions?.age}</td>
              <td>{participant.questions?.gender}</td>
              <td>{participant.questions?.riskLevel}</td>
              <td>
                {participant.questions?.probabilityOne.toString().concat("%")}
              </td>
              <td>
                {participant.questions?.probabilityTwo.toString().concat("%")}
              </td>
              <td>
                {participant.questions?.probabilityThree.toString().concat("%")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExperimentAdminPage;
