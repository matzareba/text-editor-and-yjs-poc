import React, { createContext } from "react";

export const CounterContext = createContext<{
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
}>({
  counter: 0,
  setCounter: () => {},
});