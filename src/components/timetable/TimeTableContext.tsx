import React, { createContext, useContext, useState, ReactNode } from "react";

type APIFaculty = {
  faculty: string;
  facultySlot: string[];
};

type APIResponse = {
  message: string;
  result: APIFaculty[][];
  courseNames: string[];
};

type TimetableContextType = {
  timetableData: APIResponse | null;
  setTimetableData: React.Dispatch<React.SetStateAction<APIResponse | null>>;
};

const TimetableContext = createContext<TimetableContextType | undefined>(
  undefined
);

export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [timetableData, setTimetableData] = useState<APIResponse | null>(null);

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
