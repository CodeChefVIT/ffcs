import TimeTable from "@/components/timetable/TimeTable";
import { tableFacingSlot } from "@/components/timetable/type";

const slotNames: tableFacingSlot[] = [
    { slotName: 'A1', showName: true },
    { slotName: 'A2+TA2', showName: true },
    { slotName: 'B1+TB1', showName: true },
    { slotName: 'C1+TC1', showName: true },
    { slotName: 'TG1', showName: true },
    { slotName: 'L21+L22', showName: true },
]

export default function view() {
    return <div>
        Landing Desktop
        <div style={{ width: '1000px', height: '480px', padding: '20px' }}>
            {/* always keep table containing div at 25:12 ratio */}
            {/* and no smaller than 1000px by 480px */}
            <TimeTable slotNames={slotNames} />
        </div>
    </div>
}
