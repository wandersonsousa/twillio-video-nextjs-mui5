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
const tokenFunction = require("../../server/tokenFunction");

export default function handler(req, res) {
  const tokenEndpoint = createExpressHandler(tokenFunction.handler);

  if (process.env.NEXT_PUBLIC_APP_SET_AUTH === "firebase") {
    firebaseAuthMiddleware(req, res);
  }

  tokenEndpoint(req, res);
}
