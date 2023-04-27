import BuildClient from "@/api/build-client";

export default function Home({ currentUser }) {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
}

Home.getInitialProps = async (ctx) => {
  console.log("landing page");

  const client = BuildClient(ctx);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};
