import Card from '../Card/Card';
import Icon from '../Icon/Icon';
import styles from './Column.module.css';

export default function Column({
  column,
  columns,
  boardId,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onMoveCard,
  onEditColumn,
  onDeleteColumn,
}) {
  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h3 className={styles.title}>{column.title}</h3>
        <div className={styles.headerActions}>
          <button
            className={styles.headerBtn}
            onClick={() => onEditColumn(column)}
            aria-label="Edit column"
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            className={styles.headerBtn}
            onClick={() => onDeleteColumn(column.id)}
            aria-label="Delete column"
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>

      <div className={styles.cards}>
        {column.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            columns={columns}
            boardId={boardId}
            onEdit={onEditCard}
            onDelete={(cardId) => onDeleteCard(column.id, cardId)}
            onMove={onMoveCard}
          />
        ))}
      </div>

      <button className={styles.addCardBtn} onClick={() => onAddCard(column.id)}>
        <Icon name="plus" size={14} />
        Add another card
      </button>
    </div>
  );
}
