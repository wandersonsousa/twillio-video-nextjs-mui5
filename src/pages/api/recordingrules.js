import { createExpressHandler } from "../../server/createExpressHandler";

export default function handler(req, res) {
  const recordingRulesFunction = require("@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules")
    .handler;
  const recordingRulesEndpoint = createExpressHandler(recordingRulesFunction);

  process.env.REACT_APP_SET_AUTH === "firebase" &&
    require("../../server/firebaseAuthMiddleware")(req, res);
  recordingRulesEndpoint(req, res);
}
