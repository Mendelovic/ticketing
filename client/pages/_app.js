import "bootstrap/dist/css/bootstrap.css";
import BuildClient from "@/api/build-client";
import Header from "@/components/header";

export default function App({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
}

App.getInitialProps = async (appContext) => {
  const client = BuildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};

  // Check if the Component (i.e., the rendered page component) has a getInitialProps function.
  if (appContext.Component.getInitialProps) {
    // If so, call the page component's getInitialProps function and pass in the context.
    // Store the props returned by the page component's getInitialProps function in the pageProps object.
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};
