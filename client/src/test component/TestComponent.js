"use client";
import { apiRouter } from "@/utils/apiRouter"

export const TestComponent = () => {
  return <button onClick={() => {apiRouter}}>test fetch api</button>
}