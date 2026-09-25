import Icon from '../Icon/Icon';
import styles from './HeaderDashboard.module.css';

export default function HeaderDashboard({ board, onOpenFilters }) {
  return (
    <div className={styles.headerDashboard}>
      <h1 className={styles.title}>{board.title}</h1>

      <button type="button" className={styles.filtersBtn} onClick={onOpenFilters}>
        <Icon name="filter" size={16} />
        <span>Filters</span>
      </button>
    </div>
  );
}
