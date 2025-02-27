"use client";
import { Routing } from "@/utils/backend routes"

export const TestComponent = () => {
  return <button onClick={() => {Routing.fetchApi()}}>test fetch api</button>
}