import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBoard } from '../../context/BoardContext';
import AddBoardModal from '../modals/AddBoardModal';
import EditBoardModal from '../modals/EditBoardModal';
import NeedHelpModal from '../modals/NeedHelpModal';
import Modal from '../modals/Modal';
import Icon from '../Icon/Icon';
import { BOARD_ICON_EMOJIS } from '../../constants/boardIcons';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const { logout } = useAuth();
  const { boards, deleteBoard } = useBoard();
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deletingBoard, setDeletingBoard] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDeleteBoard = async () => {
    const id = deletingBoard.id;
    await deleteBoard(id);
    setDeletingBoard(null);
    if (boardId === id) navigate('/home');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/welcome');
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" size={22} />
      </button>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <Icon name="close" size={22} />
        </button>

        <div className={styles.logo}>
          <img src="/favicon.svg" width="32" height="32" alt="" aria-hidden="true" />
          <span className={styles.logoText}>Task Pro</span>
        </div>

        <div className={styles.divider} />

        <p className={styles.label}>My boards</p>

        <button className={styles.createBtn} onClick={() => setShowAddBoard(true)}>
          <span className={styles.createLabel}>Create a new board</span>
          <span className={styles.createIcon}>
            <Icon name="plus" size={14} />
          </span>
        </button>

        <nav className={styles.nav}>
          {boards.map((board) => (
            <div
              key={board.id}
              className={`${styles.boardItem} ${boardId === board.id ? styles.active : ''}`}
              onClick={() => { navigate(`/home/${board.id}`); setMobileOpen(false); }}
            >
              <span className={styles.boardIcon}>
                {BOARD_ICON_EMOJIS[board.icon] || '🗂️'}
              </span>
              <span className={styles.boardTitle}>{board.title}</span>
              <div className={styles.boardActions}>
                <button
                  className={styles.actionBtn}
                  onClick={(e) => { e.stopPropagation(); setEditingBoard(board); }}
                  aria-label="Edit board"
                >
                  <Icon name="edit" size={16} />
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={(e) => { e.stopPropagation(); setDeletingBoard(board); }}
                  aria-label="Delete board"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </div>
          ))}
        </nav>

        <div className={styles.bottom}>
          <div className={styles.helpCard}>
            <img className={styles.helpPlant} src="/plant.png" alt="" aria-hidden="true" />
            <p className={styles.helpText}>
              If you need help with <strong>TaskPro</strong>, check out our support resources or contact our team.
            </p>
            <button className={styles.helpBtn} onClick={() => setShowHelp(true)}>
              <Icon name="help" size={16} />
              Need help?
            </button>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className={styles.logoutIcon}>
              <Icon name="logout" size={18} />
            </span>
            Log out
          </button>
        </div>
      </aside>

      {showAddBoard && <AddBoardModal onClose={() => setShowAddBoard(false)} />}
      {editingBoard && <EditBoardModal board={editingBoard} onClose={() => setEditingBoard(null)} />}
      {showHelp && <NeedHelpModal onClose={() => setShowHelp(false)} />}
      {deletingBoard && (
        <Modal title="Delete board" onClose={() => setDeletingBoard(null)}>
          <p className={styles.confirmText}>
            Delete &ldquo;<strong>{deletingBoard.title}</strong>&rdquo;? This action cannot be undone.
          </p>
          <div className={styles.confirmActions}>
            <button className={styles.confirmCancel} onClick={() => setDeletingBoard(null)}>
              Cancel
            </button>
            <button className={styles.confirmDelete} onClick={handleDeleteBoard}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
