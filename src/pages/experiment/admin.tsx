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

      <div className="overflow-x-scroll">
        <table className="overflow-x-scroll text-xs table-fixed">
          <thead>
            <tr>
              <th className="w-1/12">Participant</th>
              <th className="w-1/12">Group</th>
              <th className="w-1/12">S: Round #1</th>
              <th className="w-1/12">S: Round #2 - loss</th>
              <th className="w-1/12">S: Round #2 - win</th>
              <th className="w-1/12">S: Round #3 - loss</th>
              <th className="w-1/12">S: Round #3 - win</th>
              <th className="w-1/12">S: Round #4 - loss</th>
              <th className="w-1/12">S: Round #4 - win</th>
              <th className="w-1/12">Round #1</th>
              <th className="w-1/12"></th>
              <th className="w-1/12">Round #2</th>
              <th className="w-1/12"></th>
              <th className="w-1/12">Round #3</th>
              <th className="w-1/12"></th>
              <th className="w-1/12">Round #4</th>
              <th className="w-1/12"></th>
              <th className="w-1/12">Balance</th>
              <th className="w-1/12">Age</th>
              <th className="w-1/12">Gender</th>
              <th className="w-1/12">Risk level</th>
              <th className="w-1/12">Question #1</th>
              <th className="w-1/12">Question #2</th>
              <th className="w-1/12">Question #3</th>
            </tr>
          </thead>

          <tbody>
            {data?.participants.map((participant, index) => (
              <tr key={participant._id}>
                <td className="w-1/12">{index}</td>
                <td className="w-1/12">{participant.group}</td>
                <td className="w-1/12">{participant.strategy?.roundOneBet}</td>
                <td className="w-1/12">
                  {participant.strategy?.roundTwoBetLoss}
                </td>
                <td className="w-1/12">
                  {participant.strategy?.roundTwoBetWin}
                </td>
                <td className="w-1/12">
                  {participant.strategy?.roundThreeBetLoss}
                </td>
                <td className="w-1/12">
                  {participant.strategy?.roundThreeBetWin}
                </td>
                <td className="w-1/12">
                  {participant.strategy?.roundFourBetLoss}
                </td>
                <td className="w-1/12">
                  {participant.strategy?.roundFourBetWin}
                </td>
                <td className="w-1/12">
                  {participant.bets[0]?.amount.toFixed(2)}
                </td>
                <td className="w-1/12">{participant.bets[0]?.outcome}</td>
                <td className="w-1/12">
                  {participant.bets[1]?.amount.toFixed(2)}
                </td>
                <td className="w-1/12">{participant.bets[1]?.outcome}</td>
                <td className="w-1/12">
                  {participant.bets[2]?.amount.toFixed(2)}
                </td>
                <td className="w-1/12">{participant.bets[2]?.outcome}</td>
                <td className="w-1/12">
                  {participant.bets[3]?.amount.toFixed(2)}
                </td>
                <td className="w-1/12">{participant.bets[3]?.outcome}</td>
                <td className="w-1/12">{participant.balance.toFixed(2)}</td>
                <td className="w-1/12">{participant.questions?.age}</td>
                <td className="w-1/12">{participant.questions?.gender}</td>
                <td className="w-1/12">{participant.questions?.riskLevel}</td>
                <td className="w-1/12">
                  {participant.questions?.probabilityOne
                    ?.toString()
                    .concat("%")}
                </td>
                <td className="w-1/12">
                  {participant.questions?.probabilityTwo
                    ?.toString()
                    .concat("%")}
                </td>
                <td className="w-1/12">
                  {participant.questions?.probabilityThree
                    ?.toString()
                    .concat("%")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExperimentAdminPage;
