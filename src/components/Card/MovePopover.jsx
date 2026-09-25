import popStyles from './MovePopover.module.css';

export default function MovePopover({ columns, currentColumnId, onMove, onClose }) {
  const otherColumns = columns.filter(c => c.id !== currentColumnId);

  return (
    <div className={popStyles.overlay} onClick={onClose}>
      <div className={popStyles.popover} onClick={(e) => e.stopPropagation()}>
        <p className={popStyles.title}>Move to:</p>
        <ul className={popStyles.list}>
          {otherColumns.map(col => (
            <li key={col.id}>
              <button className={popStyles.option} onClick={() => onMove(col.id)}>
                {col.title}
              </button>
            </li>
          ))}
          {otherColumns.length === 0 && (
            <li className={popStyles.empty}>No other columns</li>
          )}
        </ul>
      </div>
    </div>
  );
}
