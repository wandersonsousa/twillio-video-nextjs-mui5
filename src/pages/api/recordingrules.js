import Twilio from "twilio";
const Runtime = {
  getAssets: () => ({
    "/auth-handler.js": {
      path: () => {},
    },
  }),
};

import { createExpressHandler } from "../../server/createExpressHandler";
import firebaseAuthMiddleware from "../../server/firebaseAuthMiddleware";
import { handler as recordingRulesFunctionHandler } from "@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules";

export default function handler(req, res) {
  const recordingRulesEndpoint = createExpressHandler(
    recordingRulesFunctionHandler
  );

  if (process.env.REACT_APP_SET_AUTH === "firebase")
    firebaseAuthMiddleware(req, res);

  recordingRulesEndpoint(req, res);
}
