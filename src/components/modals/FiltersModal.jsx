import { useBoard } from '../../context/BoardContext';
import { BOARD_BACKGROUNDS } from '../../constants/boardIcons';
import Modal from './Modal';
import styles from './FiltersModal.module.css';

const PRIORITIES = [
  { value: 'low', cssVar: 'var(--priority-low)' },
  { value: 'medium', cssVar: 'var(--priority-medium)' },
  { value: 'high', cssVar: 'var(--priority-high)' },
  { value: 'without', cssVar: 'var(--priority-without)' },
];

export default function FiltersModal({ board, priorityFilter, onPriorityFilterChange, onClose }) {
  const { updateBoard } = useBoard();

  const handleBackgroundSelect = (background) => {
    updateBoard(board.id, { background });
  };

  return (
    <Modal title="Filters" onClose={onClose}>
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Background</p>
        <div className={styles.bgGrid}>
          {BOARD_BACKGROUNDS.map((bg, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.bgBtn} ${board.background === bg ? styles.selected : ''}`}
              onClick={() => handleBackgroundSelect(bg)}
              title={bg || 'No background'}
            >
              {bg ? (
                <img
                  src={bg}
                  alt={`background ${i}`}
                  className={styles.bgPreview}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className={styles.noBg}>∅</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Priority</p>
        <div className={styles.priorityGroup}>
          <button
            type="button"
            className={`${styles.priorityOption} ${priorityFilter === null ? styles.selected : ''}`}
            onClick={() => onPriorityFilterChange(null)}
          >
            All
          </button>

          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`${styles.priorityOption} ${priorityFilter === p.value ? styles.selected : ''}`}
              onClick={() => onPriorityFilterChange(p.value)}
            >
              <span className={styles.priorityDot} style={{ background: p.cssVar }} />
              {p.value === 'without' ? 'No priority' : p.value}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
