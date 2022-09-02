import "dotenv/config";
import Twilio from "twilio";

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  TWILIO_CONVERSATIONS_SERVICE_SID,
  REACT_APP_TWILIO_ENVIRONMENT,
} = process.env;

const twilioClient = Twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID,
  region:
    REACT_APP_TWILIO_ENVIRONMENT === "prod"
      ? undefined
      : REACT_APP_TWILIO_ENVIRONMENT,
});
const context = {
  ACCOUNT_SID: TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  ROOM_TYPE: "group",
  CONVERSATIONS_SERVICE_SID: TWILIO_CONVERSATIONS_SERVICE_SID,
  getTwilioClient: () => twilioClient,
};

export function createExpressHandler(serverlessFunction) {
  return (req, res) => {
    serverlessFunction(context, req.body, (_, serverlessResponse) => {
      const { statusCode, headers, body } = serverlessResponse;

      res
        .status(statusCode)
        .set(headers)
        .json(body);
    });
  };
}
