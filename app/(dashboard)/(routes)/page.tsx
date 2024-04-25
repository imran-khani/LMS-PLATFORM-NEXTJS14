import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
   <div>
    helllo
    <UserButton
    afterSignOutUrl="/"
    />
   </div>
  );
}
