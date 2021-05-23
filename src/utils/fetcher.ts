const fetcher = async <T>(input: RequestInfo, init?: RequestInit) => {
  const id = process.browser && localStorage.getItem("id");
  const url = `${input}?id=${id}`;

  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: {
      ["Content-Type"]: "application/json",
    },
  });

  return (await response.json()) as T;
};

const get = <T>(input: RequestInfo) => fetcher<T>(input, { method: "GET" });
const patch = <T>(input: RequestInfo, init?: RequestInit) =>
  fetcher<T>(input, { ...init, method: "PATCH" });
const post = <T>(input: RequestInfo, init?: RequestInit) =>
  fetcher<T>(input, { ...init, method: "POST" });

export default {
  get,
  patch,
  post,
};
