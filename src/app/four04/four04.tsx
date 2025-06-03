'use client';

import TimeTable from '@/components/TimeTable';

const slotNames: string[] = [
    'A1',
    'B2',
    'C1+TC1',
    'D2',
    'L21+L22',
]

export default function View() {
    return (
        <div>
            404 Desktop
            <div style={{ width: '1300px', height: '600px', padding: '20px' }}>
                <TimeTable slotNames={slotNames} />
            </div>
        </div>
    );
}
