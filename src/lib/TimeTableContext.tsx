import React, { createContext, useContext, useState, ReactNode } from "react";
import { timetableDisplayData } from "@/lib/type";

type TimetableContextType = {
  timetableData: timetableDisplayData[][] | null;
  setTimetableData: React.Dispatch<
    React.SetStateAction<timetableDisplayData[][] | null>
  >;
};

const TimetableContext = createContext<TimetableContextType | undefined>(
  undefined
);

export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [timetableData, setTimetableData] = useState<
    timetableDisplayData[][] | null
  >(null);

  return (
    <TimetableContext.Provider value={{ timetableData, setTimetableData }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error("useTimetable must be used within a TimetableProvider");
  }
  return context;
};
