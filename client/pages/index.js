import Head from "next/head";
import HomePage from "@/components/HomePage/HomePage";

const Home = () => {
  return (
    <>
      <Head>
        <title>SecretEcho</title>
      </Head>
      <HomePage />
    </>
  );
};

export default Home;
