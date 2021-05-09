import { AppProps } from "next/app";

import "tailwindcss/tailwind.css";

const App = ({ Component, pageProps }: AppProps) => (
  <main className="w-3/5 mx-auto my-8 prose">
    <Component {...pageProps} />
  </main>
);

export default App;
