'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { timetableDisplayData } from '@/lib/type';

type TimetableContextType = {
  timetableData: timetableDisplayData[][] | null;
  setTimetableData: React.Dispatch<React.SetStateAction<timetableDisplayData[][] | null>>;
};

const TIMETABLE_STORAGE_KEY = 'generatedTimetableData';

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [timetableData, setTimetableDataState] = useState<timetableDisplayData[][] | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TIMETABLE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimetableDataState(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load generated timetable data from localStorage:', e);
    }
  }, []);

  const setTimetableData: React.Dispatch<
    React.SetStateAction<timetableDisplayData[][] | null>
  > = value => {
    setTimetableDataState(prev => {
      const next =
        typeof value === 'function'
          ? (value as (prev: timetableDisplayData[][] | null) => timetableDisplayData[][] | null)(
              prev
            )
          : value;
      try {
        if (next && next.length > 0) {
          localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(next));
        } else {
          localStorage.removeItem(TIMETABLE_STORAGE_KEY);
        }
      } catch (e) {
        console.error('Failed to save generated timetable data to localStorage:', e);
      }
      return next;
    });
  };

  return (
    <TimetableContext.Provider value={{ timetableData, setTimetableData }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};
