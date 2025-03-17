"use client";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  return (
    <div>
      <h1>test</h1>
      <button
        onClick={() => {
          router.push("/userSettings");
        }}
      >go to user settings</button>
    </div>
  );
}
