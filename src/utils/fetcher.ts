const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, {
    ...init,
    headers: {
      ["Content-Type"]: "application/json",
    },
    credentials: "same-origin",
  }).then((res) => res.json());

export default fetcher;
