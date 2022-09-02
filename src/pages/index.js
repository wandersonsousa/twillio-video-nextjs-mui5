import Head from "next/head";
import Image from "next/image";
import { TwillioVideoChat } from "../components/twillio-video-chat";
import styles from "../styles/Home.module.css";

export default function Home() {
  return <TwillioVideoChat />;
}
