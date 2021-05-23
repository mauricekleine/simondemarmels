import useSWR from "swr";

import { Participant } from "../types/participants";
import fetcher from "../utils/fetcher";

const useParticipant = () => {
  const shouldFetchParticipant = Boolean(
    process.browser && localStorage.getItem("id")
  );

  const { data, isValidating, mutate } = useSWR<{ participant: Participant }>(
    `/api/participants/current`,
    fetcher.get,
    {
      revalidateOnFocus: false,
      revalidateOnMount: shouldFetchParticipant,
      shouldRetryOnError: false,
    }
  );

  return {
    isLoading: isValidating,
    mutate,
    participant: data?.participant,
  };
};

export default useParticipant;
