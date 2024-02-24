import Image from "next/image";
import { Inter } from "next/font/google";
import JoinRoomButton from "./components/JoinRoomButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <h1>BrickHacks</h1>
      
      <JoinRoomButton room="room1" />
    </div>
  );
}
