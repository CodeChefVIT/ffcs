'use client';

import React from 'react';
import { slot } from './timetable/type';
import { getSlot, getAllSlots } from '../lib/slots';

export default function TimeTable({ slotNames }: { slotNames: string[] }) {

	const slots: slot[] = slotNames.map(slotNames => getSlot(slotNames, true)).flat();

	const ROWS = 17
	const COLUMNS = 69;
	const ROW_WEIGHTS = [5, 5, 2, 5, 5, 2, 5, 5, 2, 5, 5, 2, 5, 5, 2, 5, 5];
	const COLUMN_WEIGHTS = Array(69).fill(1).map((v, i) => (i === 0 ? 5 : 1));

	const totalRowWeight = ROW_WEIGHTS.reduce((a, b) => a + b, 0);
	const gridTemplateRows = ROW_WEIGHTS.map(w => `${(w / totalRowWeight) * 100}%`).join(' ');
	const totalColWeight = COLUMN_WEIGHTS.reduce((a, b) => a + b, 0);
	const gridTemplateColumns = COLUMN_WEIGHTS.map(w => `${(w / totalColWeight) * 100}%`).join(' ');

	const MERGE_CELLS_VERTICAL = [
		{ col: 1, rowStart: 4, rowEnd: 6, slotName: 'Mon' },
		{ col: 1, rowStart: 7, rowEnd: 9, slotName: 'Tue' },
		{ col: 1, rowStart: 10, rowEnd: 12, slotName: 'Wed' },
		{ col: 1, rowStart: 13, rowEnd: 15, slotName: 'Thu' },
		{ col: 1, rowStart: 16, rowEnd: 18, slotName: 'Fri' },
	]

	const MERGE_CELLS_HORIZONTAL: slot[] = [
		{ colStart: 2, colEnd: 3, row: 1, slotName: '8' },
		{ colStart: 8, colEnd: 9, row: 1, slotName: '9' },
		{ colStart: 14, colEnd: 15, row: 1, slotName: '10' },
		{ colStart: 20, colEnd: 21, row: 1, slotName: '11' },
		{ colStart: 26, colEnd: 27, row: 1, slotName: '12' },
		{ colStart: 32, colEnd: 33, row: 1, slotName: '1' },
		{ colStart: 38, colEnd: 39, row: 1, slotName: '2' },
		{ colStart: 44, colEnd: 45, row: 1, slotName: '3' },
		{ colStart: 50, colEnd: 51, row: 1, slotName: '4' },
		{ colStart: 56, colEnd: 57, row: 1, slotName: '5' },
		{ colStart: 62, colEnd: 63, row: 1, slotName: '6' },
		{ colStart: 68, colEnd: 69, row: 1, slotName: '7' },

		{ colStart: 2, colEnd: 32, row: 2, slotName: 'Morning Theory' },
		{ colStart: 32, colEnd: 38, row: 2, slotName: 'Break' },
		{ colStart: 38, colEnd: 70, row: 2, slotName: 'Evening Theory' },

		{ colStart: 2, colEnd: 70, row: 3, slotName: '' },
		{ colStart: 2, colEnd: 70, row: 6, slotName: '' },
		{ colStart: 2, colEnd: 70, row: 9, slotName: '' },
		{ colStart: 2, colEnd: 70, row: 12, slotName: '' },
		{ colStart: 2, colEnd: 70, row: 15, slotName: '' },

		{ colStart: 31, colEnd: 38, row: 4, slotName: '' },
		{ colStart: 31, colEnd: 38, row: 7, slotName: '' },
		{ colStart: 19, colEnd: 38, row: 10, slotName: '' },
		{ colStart: 31, colEnd: 38, row: 13, slotName: '' },
		{ colStart: 31, colEnd: 38, row: 16, slotName: '' },

		{ colStart: 34, colEnd: 38, row: 5, slotName: '' },
		{ colStart: 34, colEnd: 38, row: 8, slotName: '' },
		{ colStart: 34, colEnd: 38, row: 11, slotName: '' },
		{ colStart: 34, colEnd: 38, row: 14, slotName: '' },
		{ colStart: 34, colEnd: 38, row: 17, slotName: '' },

		{ colStart: 67, colEnd: 70, row: 4, slotName: '' },
		{ colStart: 67, colEnd: 70, row: 7, slotName: '' },
		{ colStart: 67, colEnd: 70, row: 10, slotName: '' },
		{ colStart: 67, colEnd: 70, row: 13, slotName: '' },
		{ colStart: 67, colEnd: 70, row: 16, slotName: '' },
	]

	const MERGE_CELLS_SLOTS: slot[] = [];
	const allSlotsWithoutName: slot[] = getAllSlots().map(slotName => getSlot(slotName, true)).flat();
	MERGE_CELLS_SLOTS.push(
		...allSlotsWithoutName.map(slot => ({
			colStart: slot.colStart,
			colEnd: slot.colEnd,
			row: slot.row,
			slotName: slot.slotName,
		}))
	);

	const cells = [];
	for (let row = 1; row <= ROWS; row++) {
		for (let col = 1; col <= COLUMNS; col++) {
			cells.push(
				<div
					key={`cell-${row}-${col}`}
					style={{
						border: '0.5px solid #000000',
						// boxShadow: '0 0 0 0.5px #000000',
						width: '100%',
						height: '100%',
						boxSizing: 'border-box',
						gridColumn: col,
						gridRow: row,
						backgroundColor: '#ffffff',
					}}
				/>
			);
		}
	}

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns,
				gridTemplateRows,
				gap: '0px',
				backgroundColor: '#000000',
				position: 'relative',
				width: '100%',
				height: '100%',
				padding: '1px',
				// border: '1px solid #000000',
				userSelect: 'none',
			}}
		>
			{cells}

			<div
				key={`image-cell`}
				style={{
					gridColumn: 1,
					gridRowStart: 1,
					gridRowEnd: 3,
					backgroundColor: '#ffffff',
					border: '0.5px solid #000000',
					boxSizing: 'border-box',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<img
					src="/next.svg"
					alt="Next.js Logo"
					style={{ width: '50%', height: 'auto', display: 'block' }}
				/>
			</div>

			{MERGE_CELLS_VERTICAL.map((cell, i) => (
				<div
					key={`merge-cell-${i}`}
					style={{
						gridColumn: cell.col,
						gridRowStart: cell.rowStart,
						gridRowEnd: cell.rowEnd,
						backgroundColor: '#ffffff',
						border: '0.5px solid #000000',
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
					}}
				>
					<span
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 'clamp(8px, 1vw, 18px)', // Responsive font size
							fontWeight: 'bold',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{cell.slotName}
					</span>
				</div>
			))}

			{MERGE_CELLS_HORIZONTAL.map((cell, i) => (
				<div
					key={`merge-cell-${i}`}
					style={{
						gridColumnStart: cell.colStart,
						gridColumnEnd: cell.colEnd,
						gridRow: cell.row,
						backgroundColor: '#ffffff',
						border: '0.5px solid #000000',
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
					}}
				>
					<span
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 'clamp(8px, 0.8vw, 18px)', // Responsive font size
							fontWeight: 'bold',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{cell.slotName}
					</span>
				</div>
			))}

			{MERGE_CELLS_SLOTS.map((cell, i) => (
				<div
					key={`slot-${i}`}
					style={{
						gridColumnStart: cell.colStart,
						gridColumnEnd: cell.colEnd,
						gridRow: cell.row,
						backgroundColor: '#ffffff',
						border: '0.5px solid #000000',
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
					}}
				>
					<span
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 'clamp(8px, 0.8vw, 18px)', // Responsive font size
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{cell.slotName}
					</span>
				</div>
			))}



			{slots.map((slot, i) => (
				// if slot name stars with L then green color bgt else blue
				<div
					key={`slot-${i}`}
					style={{
						gridColumnStart: slot.colStart,
						gridColumnEnd: slot.colEnd,
						gridRow: slot.row,
						backgroundColor: slot.slotName.startsWith('L') ? '#96FFC8' : '#64C8FF',
						border: '0.5px solid #000000',
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
					}}
				>
					<span
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 'clamp(8px, 0.8vw, 18px)', // Responsive font size
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{slot.slotName}
					</span>
				</div>

			))}

		</div>
	);
}

