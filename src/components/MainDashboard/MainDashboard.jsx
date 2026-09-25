import Column from '../Column/Column';
import Icon from '../Icon/Icon';
import styles from './MainDashboard.module.css';

export default function MainDashboard({
  board,
  priorityFilter,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onMoveCard,
  onAddColumnClick,
  onEditColumn,
  onDeleteColumn,
}) {
  const visibleColumns = priorityFilter
    ? board.columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => (card.priority || 'without') === priorityFilter),
      }))
    : board.columns;

  return (
    <div
      className={styles.board}
      style={board.background ? { backgroundImage: `url(${board.background})` } : undefined}
    >
      {visibleColumns.map((column) => (
        <Column
          key={column.id}
          column={column}
          columns={board.columns}
          boardId={board.id}
          onAddCard={onAddCard}
          onEditCard={(card) => onEditCard(card, column.id)}
          onDeleteCard={onDeleteCard}
          onMoveCard={onMoveCard}
          onEditColumn={onEditColumn}
          onDeleteColumn={onDeleteColumn}
        />
      ))}

      <button className={styles.addColBtn} onClick={onAddColumnClick}>
        <Icon name="plus" size={14} />
        Add another column
      </button>
    </div>
  );
}
