import { createExpressHandler } from "../../server/createExpressHandler";

export default function handler(req, res) {
  const tokenFunction = require("@twilio-labs/plugin-rtc/src/serverless/functions/token")
    .handler;
  const tokenEndpoint = createExpressHandler(tokenFunction);

  process.env.REACT_APP_SET_AUTH === "firebase" &&
    require("../../server/firebaseAuthMiddleware")(req, res);
  tokenEndpoint(req, res);
}
