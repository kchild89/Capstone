"use client";

import validateToken from "@/utils/validateToken";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserSettingsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState("");


  useEffect(() => {
    async function auth() {
      const valid = await validateToken();
      if (!valid) {
        router.push("/login");
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    }
    auth();
  }, [router]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!authorized) {
    return null;
  }


  return <div>{error}test</div>;
}
