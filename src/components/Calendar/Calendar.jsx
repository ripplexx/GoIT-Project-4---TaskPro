import { useState } from 'react';
import Icon from '../Icon/Icon';
import styles from './Calendar.module.css';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function Calendar({ value, onChange, onClose, minDate }) {
  const selected = value ? new Date(value) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(selected ? selected.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth() : today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    if (isDisabled(day)) return;
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
    onClose();
  };

  const isDisabled = (day) => {
    if (!minDate) return false;
    const [minY, minM, minD] = minDate.split('-').map(Number);
    if (viewYear < minY) return true;
    if (viewYear === minY && viewMonth < minM - 1) return true;
    if (viewYear === minY && viewMonth === minM - 1 && day < minD) return true;
    return false;
  };

  const isSelected = (day) => {
    if (!selected) return false;
    return selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;
  };

  const isToday = (day) => {
    const now = new Date();
    return now.getFullYear() === viewYear && now.getMonth() === viewMonth && now.getDate() === day;
  };

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <span key={`prev-${i}`} className={styles.dayOther}>
        {prevMonthDays - firstDay + 1 + i}
      </span>
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDisabled(day);
    const sel = isSelected(day);
    const tod = isToday(day);

    cells.push(
      <button
        key={day}
        type="button"
        disabled={disabled}
        className={`${styles.day} ${sel ? styles.daySelected : ''} ${tod && !sel ? styles.dayToday : ''} ${disabled ? styles.dayDisabled : ''}`}
        onClick={() => handleDayClick(day)}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.calendar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button type="button" className={styles.navBtn} onClick={prevMonth}>
            <Icon name="chevron-down" size={16} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <span className={styles.monthYear}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button type="button" className={styles.navBtn} onClick={nextMonth}>
            <Icon name="chevron-down" size={16} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.weekdays}>
          {DAYS.map(d => (
            <span key={d} className={styles.weekday}>{d}</span>
          ))}
        </div>

        <div className={styles.grid}>
          {cells}
        </div>
      </div>
    </div>
  );
}
