import classNames from "classnames";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

import useParticipant from "../hooks/participant.hook";

import "tailwindcss/tailwind.css";

const App = ({ Component, pageProps }: AppProps) => {
  const { isLoading, participant } = useParticipant();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isStartPage = !router.pathname.startsWith("/experiment");
    const isRoundsPage = router.pathname === "/experiment/rounds";
    const isQuestionsPage = router.pathname === "/experiment/questions";

    if (router.pathname.includes("admin")) {
      return;
    }

    if (!participant && !isStartPage) {
      router.replace("/");
      return;
    }

    if (participant && isStartPage) {
      if (participant.bets.length === 4) {
        router.replace("/experiment/questions");
        return;
      } else {
        router.replace("/experiment/rounds");
        return;
      }
    }

    if (participant && isRoundsPage) {
      if (participant.bets.length === 4) {
        router.replace("/experiment/questions");
        return;
      }
    }

    if (participant && isQuestionsPage) {
      if (participant.bets.length !== 4) {
        router.replace("/experiment/rounds");
        return;
      }
    }
  }, [isLoading, participant, router]);

  return (
    <main
      className={classNames("my-8 prose", {
        "w-3/5 mx-auto": !router.pathname.includes("admin"),
      })}
    >
      <Component {...pageProps} />
    </main>
  );
};

export default App;
