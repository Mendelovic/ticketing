import axios from "axios";

// This function is used to create an axios instance based on whether the code is being run on the server or the client.
// It takes a `req` object as an argument, which is used to set the headers if the code is being run on the server.
export default function BuildClient({ req }) {
  if (typeof window === "undefined") {
    // If the code is being run on the server, create an axios instance with the `baseURL` set to the ingress-nginx-controller.
    // Because ingress-nginx-controller is in another namespace, request should reach namespace of ingress-nginx
    // - Attach the headers of the original request
    // - Including the cookie that holds the JWT, and the host ('ticketing.dev') to the new request

    // DEV
    // return axios.create({
    //   baseURL:
    //     "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    //   headers: req.headers,
    // });

    // PROD
    return axios.create({
      baseURL: "http://www.ticketing-app-prod.xyz/",
      headers: req.headers,
    });
  } else {
    // If the code is being run on the client, create an axios instance with the `baseURL` set to the root URL.
    return axios.create({
      baseURL: "/",
    });
  }
}
