import TimeTable from "@/components/timetable/TimeTable";
import { RegularButton, ToggleButton } from "@/components/ui/Buttons";
import { clashMap, getAllSlots } from "@/lib/slots";
import { useState } from "react";

export default function View() {
  const [active, setActive] = useState<number[]>([]);

  const buttonTexts = getAllSlots();

  // Map of which buttons disable which (example: 'a' disables 'h' and 'y')
  const disableMap = clashMap;

  const handleClick = (index: number) => {
    if (active.includes(index)) {
      setActive(active.filter((i) => i !== index)); // Deselect if already active
    } else {
      setActive([...active, index]); // Add this button as active
    }
  };

  return (
    <div>
      Slots Desktop

      <div className="flex gap-2 flex-wrap">
        {buttonTexts.map((text, idx) => {
          // If any active button disables this one
          const activeTexts = active.map((i) => buttonTexts[i]);
          const isDisabled = activeTexts.some(
            (activeText) => disableMap[activeText.split("+")[0]]?.includes(text.split("+")[0])
          );
          return (
            <RegularButton
              key={text}
              text={text}
              color="blue"
              clicked={active.includes(idx)}
              disabled={!!isDisabled}
              onClick={() => handleClick(idx)}
            />
          );
        })}
        <ToggleButton />
      </div>

      <div style={{ width: '1000px', height: '480px' }}>
        <TimeTable slotNames={active.map(i => ({ slotName: buttonTexts[i], showName: true }))} />
      </div>
    </div >



  );
}
