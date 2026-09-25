import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../../context/BoardContext';
import HeaderDashboard from '../../components/HeaderDashboard/HeaderDashboard';
import MainDashboard from '../../components/MainDashboard/MainDashboard';
import CreateCardModal from '../../components/modals/CreateCardModal';
import EditCardModal from '../../components/modals/EditCardModal';
import AddColumnModal from '../../components/modals/AddColumnModal';
import EditColumnModal from '../../components/modals/EditColumnModal';
import FiltersModal from '../../components/modals/FiltersModal';
import styles from './ScreensPage.module.css';

export default function ScreensPage() {
  const { boardId } = useParams();
  const {
    boards,
    activeBoard,
    setActiveBoardId,
    addColumn,
    updateColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  } = useBoard();

  const [createCardColumnId, setCreateCardColumnId] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editingCardColumnId, setEditingCardColumnId] = useState(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(null);

  useEffect(() => {
    if (boardId) {
      setActiveBoardId(boardId);
    } else if (boards.length > 0) {
      setActiveBoardId(boards[0].id);
    }
  }, [boardId, boards, setActiveBoardId]);

  if (!activeBoard) {
    return (
      <div className={styles.empty}>
        <p>No board selected. Create a board from the sidebar.</p>
      </div>
    );
  }

  const handleAddCard = (columnId) => {
    setCreateCardColumnId(columnId);
  };

  const handleCreateCard = async (cardData) => {
    await addCard(activeBoard.id, createCardColumnId, cardData);
    setCreateCardColumnId(null);
  };

  const handleEditCard = (card, columnId) => {
    setEditingCard(card);
    setEditingCardColumnId(columnId);
  };

  const handleUpdateCard = async (cardData) => {
    await updateCard(activeBoard.id, editingCardColumnId, editingCard.id, cardData);
    setEditingCard(null);
    setEditingCardColumnId(null);
  };

  const handleDeleteCard = async (columnId, cardId) => {
    await deleteCard(activeBoard.id, columnId, cardId);
  };

  const handleMoveCard = async (moveData) => {
    await moveCard(activeBoard.id, moveData);
  };

  const handleAddColumn = async (data) => {
    await addColumn(activeBoard.id, data);
  };

  const handleEditColumn = (column) => {
    setEditingColumn(column);
  };

  const handleUpdateColumn = async (columnId, data) => {
    await updateColumn(activeBoard.id, columnId, data);
  };

  const handleDeleteColumn = (columnId) => {
    deleteColumn(activeBoard.id, columnId);
  };

  return (
    <div className={styles.page}>
      <HeaderDashboard board={activeBoard} onOpenFilters={() => setShowFilters(true)} />

      <MainDashboard
        board={activeBoard}
        priorityFilter={priorityFilter}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onMoveCard={handleMoveCard}
        onAddColumnClick={() => setShowAddColumn(true)}
        onEditColumn={handleEditColumn}
        onDeleteColumn={handleDeleteColumn}
      />

      {createCardColumnId && (
        <CreateCardModal
          onClose={() => setCreateCardColumnId(null)}
          onSubmit={handleCreateCard}
        />
      )}

      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => { setEditingCard(null); setEditingCardColumnId(null); }}
          onSubmit={handleUpdateCard}
        />
      )}

      {showAddColumn && (
        <AddColumnModal
          onClose={() => setShowAddColumn(false)}
          onSubmit={handleAddColumn}
        />
      )}

      {editingColumn && (
        <EditColumnModal
          column={editingColumn}
          onClose={() => setEditingColumn(null)}
          onSubmit={handleUpdateColumn}
        />
      )}

      {showFilters && (
        <FiltersModal
          board={activeBoard}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
