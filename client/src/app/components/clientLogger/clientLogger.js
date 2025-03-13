"use client";

import { useEffect } from "react";

export default function ClientLogger() {
  useEffect(() => {
    const handleError = (message, source, lineno, colno, error) => {
      const logMessage = `Error: ${message} at ${source}:${lineno}:${colno}`;
      console.error(logMessage);

      // Send to server
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: "error", message: logMessage }),
      }).catch((err) => console.error("Failed to send log:", err));
    };
    window.addEventListener(
      "error",
      (ev) => {
        handleError(ev.message, null, ev.lineno, ev.colno, ev.error);
      },
      { capture: true }
    );

    return () => {
      window.onerror = null;
    };
  }, []);

  return null;
}
