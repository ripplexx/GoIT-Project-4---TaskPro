import { useState } from 'react';
import Icon from '../Icon/Icon';
import MovePopover from './MovePopover';
import { isDueToday, formatDeadline } from '../../utils/dateHelpers';
import styles from './Card.module.css';

export default function Card({ card, columnId, columns, onEdit, onDelete, onMove }) {
  const [showMove, setShowMove] = useState(false);

  const priorityColor = `var(--priority-${card.priority || 'without'})`;

  return (
    <div className={styles.card}>
      <h4 className={styles.title}>{card.title}</h4>
      {card.description && (
        <p className={styles.description}>{card.description}</p>
      )}

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.priority} style={{ background: priorityColor }} />
          {card.deadline && (
            <span className={styles.deadline}>{formatDeadline(card.deadline)}</span>
          )}
        </div>

        <div className={styles.actions}>
          {card.deadline && isDueToday(card.deadline) && (
            <span className={styles.bell} aria-label="Due today">
              <Icon name="bell" size={16} />
            </span>
          )}
          <button className={styles.actionBtn} onClick={() => onEdit(card)} aria-label="Edit card">
            <Icon name="pencil" size={16} />
          </button>
          <button className={styles.actionBtn} onClick={() => setShowMove(true)} aria-label="Move card">
            <Icon name="arrow-right" size={16} />
          </button>
          <button className={styles.actionBtn} onClick={() => onDelete(card.id)} aria-label="Delete card">
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      {showMove && (
        <MovePopover
          columns={columns}
          currentColumnId={columnId}
          onMove={(toColumnId) => {
            onMove({ fromColumnId: columnId, toColumnId, cardId: card.id, toIndex: 0 });
            setShowMove(false);
          }}
          onClose={() => setShowMove(false)}
        />
      )}
    </div>
  );
}
