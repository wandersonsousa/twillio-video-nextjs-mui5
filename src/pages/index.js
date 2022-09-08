import dynamic from "next/dynamic";
const DynamicTwilioVideoChat = dynamic(
  () => import("../components/twillio-video-chat"),
  {
    ssr: false,
  }
);
export default function Home() {
  return <DynamicTwilioVideoChat />;
}
