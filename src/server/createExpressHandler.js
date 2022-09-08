import "dotenv/config";
import Twilio from "twilio";

const {
  NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
  NEXT_PUBLIC_TWILIO_API_KEY_SID,
  NEXT_PUBLIC_TWILIO_API_KEY_SECRET,
  NEXT_PUBLIC_TWILIO_CONVERSATIONS_SERVICE_SID,
  REACT_APP_TWILIO_ENVIRONMENT,
} = process.env;

const twilioClient = Twilio(
  NEXT_PUBLIC_TWILIO_API_KEY_SID,
  NEXT_PUBLIC_TWILIO_API_KEY_SECRET,
  {
    accountSid: NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
    region:
      REACT_APP_TWILIO_ENVIRONMENT === "prod"
        ? undefined
        : REACT_APP_TWILIO_ENVIRONMENT,
  }
);
const context = {
  ACCOUNT_SID: NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID: NEXT_PUBLIC_TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET: NEXT_PUBLIC_TWILIO_API_KEY_SECRET,
  ROOM_TYPE: "group",
  CONVERSATIONS_SERVICE_SID: NEXT_PUBLIC_TWILIO_CONVERSATIONS_SERVICE_SID,
  getTwilioClient: () => twilioClient,
};

export function createExpressHandler(serverlessFunction) {
  return (req, res) => {
    serverlessFunction(context, req.body, (_, serverlessResponse) => {
      const { statusCode, headers, body } = serverlessResponse;
      res.status(statusCode).json(body);
    });
  };
}
