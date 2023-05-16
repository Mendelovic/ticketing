import useRequest from "@/hooks/use-request";
import Router from "next/router";
import { useEffect } from "react";

export default function Signout() {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      Router.replace("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, [doRequest]);

  return <div>Signing you out...</div>;
}
