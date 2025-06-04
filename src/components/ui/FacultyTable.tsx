import React from 'react';
import { IFacultyData } from '@/lib/type';
import styles from './FacultyTable.module.css';

interface Props {
  facultyData?: IFacultyData;
  list: IFacultyData[];
}

export default function FacultyTable({ list }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Faculty List</h2>
      <ul className={styles.list}>
        {list.map((fac, idx) => (
          <li key={idx} className={styles.item}>
            <strong>{fac.faculty}</strong>: {fac.facultySlot.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
