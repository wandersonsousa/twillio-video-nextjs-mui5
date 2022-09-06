import Twilio from "twilio";
import { createExpressHandler } from "../../server/createExpressHandler";
import { handler as tokenFunctionHandler } from "../../server/tokenFunction";
import firebaseAuthMiddleware from "../../server/firebaseAuthMiddleware";

export default function handler(req, res) {
  const tokenEndpoint = createExpressHandler(tokenFunctionHandler);

  if (process.env.REACT_APP_SET_AUTH === "firebase") {
    firebaseAuthMiddleware(req, res);
  }

  tokenEndpoint(req, res);
}
