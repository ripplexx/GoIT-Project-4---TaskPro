import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as boardApi from '../api/board.api';
import { useAuth } from './AuthContext';

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  // Board verisi kullanıcıya özel olduğu için AuthContext'e bağımlı, bu yüzden
  // BoardProvider'ı main.jsx'te AuthProvider'ın İÇİNE koymak şart
  const { isLoggedIn } = useAuth();
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardIdState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // isLoggedIn değiştiğinde board listesini otomatik çekiyorum (login olunca yükle, logout olunca temizle)
  // Eskiden App.jsx bunu manuel dispatch ediyordu, burada toplamak daha mantıklı geldi
  useEffect(() => {
    if (!isLoggedIn) {
      setBoards([]);
      setActiveBoardIdState(null);
      return;
    }
    setIsLoading(true);
    boardApi
      .getBoards()
      .then(data => {
        setBoards(data);
        // Daha önce seçili bir board varsa onu eziyorum, yoksa ilk board'u otomatik seçiyorum
        setActiveBoardIdState(prev => prev ?? data[0]?.id ?? null);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [isLoggedIn]);

  const setActiveBoardId = useCallback(id => setActiveBoardIdState(id), []);

  const createBoard = useCallback(async data => {
    const board = await boardApi.createBoard(data);
    setBoards(prev => [...prev, board]);
    // Yeni board'u direkt aktif yapıyorum, kullanıcı oluşturduğu board'u hemen görsün
    setActiveBoardIdState(board.id);
    return board;
  }, []);

  const updateBoard = useCallback(async (boardId, data) => {
    const updated = await boardApi.updateBoard(boardId, data);
    setBoards(prev => prev.map(b => (b.id === updated.id ? updated : b)));
    return updated;
  }, []);

  const deleteBoard = useCallback(async boardId => {
    await boardApi.deleteBoard(boardId);
    // setBoards'ın updater fonksiyonu içinden setActiveBoardIdState çağırıyorum,
    // çünkü silinen board aktif olansa yeni aktif board'u (kalan listenin ilki) seçmek için
    // güncel "next" listesine ihtiyacım var; ayrı bir state'ten okusam bayatlamış veri alırdım
    setBoards(prev => {
      const next = prev.filter(b => b.id !== boardId);
      setActiveBoardIdState(prevId => (prevId === boardId ? next[0]?.id ?? null : prevId));
      return next;
    });
  }, []);

  // Redux Toolkit'te Immer sayesinde "state.board.columns.push(...)" gibi direkt mutasyon yazılabiliyordu,
  // burada useState ile çalıştığımız için her güncellemeyi spread ile immutable yapmak zorundayım
  const addColumn = useCallback(async (boardId, data) => {
    const column = await boardApi.addColumn(boardId, data);
    setBoards(prev =>
      prev.map(b => (b.id === boardId ? { ...b, columns: [...b.columns, column] } : b))
    );
    return column;
  }, []);

  const updateColumn = useCallback(async (boardId, columnId, data) => {
    const column = await boardApi.updateColumn(boardId, columnId, data);
    setBoards(prev =>
      prev.map(b =>
        b.id !== boardId
          ? b
          : { ...b, columns: b.columns.map(c => (c.id === columnId ? column : c)) }
      )
    );
    return column;
  }, []);

  const deleteColumn = useCallback(async (boardId, columnId) => {
    await boardApi.deleteColumn(boardId, columnId);
    setBoards(prev =>
      prev.map(b =>
        b.id === boardId ? { ...b, columns: b.columns.filter(c => c.id !== columnId) } : b
      )
    );
  }, []);

  const addCard = useCallback(async (boardId, columnId, data) => {
    const card = await boardApi.addCard(boardId, columnId, data);
    setBoards(prev =>
      prev.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(c => (c.id === columnId ? { ...c, cards: [...c.cards, card] } : c)),
        };
      })
    );
    return card;
  }, []);

  const updateCard = useCallback(async (boardId, columnId, cardId, data) => {
    const card = await boardApi.updateCard(boardId, columnId, cardId, data);
    setBoards(prev =>
      prev.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(c => {
            if (c.id !== columnId) return c;
            return { ...c, cards: c.cards.map(cd => (cd.id === cardId ? card : cd)) };
          }),
        };
      })
    );
    return card;
  }, []);

  const deleteCard = useCallback(async (boardId, columnId, cardId) => {
    await boardApi.deleteCard(boardId, columnId, cardId);
    setBoards(prev =>
      prev.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(c =>
            c.id === columnId ? { ...c, cards: c.cards.filter(cd => cd.id !== cardId) } : c
          ),
        };
      })
    );
  }, []);

  // Kartı bir kolondan diğerine taşımanın (sürükle-bırak) state tarafı karmaşık olacağı için
  // burada hile yapıp mutasyondan sonra board listesini sunucudan/mock'tan baştan çekiyorum
  const moveCard = useCallback(async (boardId, moveData) => {
    await boardApi.moveCard(boardId, moveData);
    const data = await boardApi.getBoards();
    setBoards(data);
  }, []);

  // activeBoard'u her render'da boards + activeBoardId'den türetiyorum, ayrı bir state'te
  // tutmadım çünkü iki kaynağın senkron kalmasını ayrıca uğraşmak istemedim
  const activeBoard = boards.find(b => b.id === activeBoardId) ?? null;

  return (
    <BoardContext.Provider
      value={{
        boards,
        activeBoardId,
        activeBoard,
        isLoading,
        error,
        setActiveBoardId,
        createBoard,
        updateBoard,
        deleteBoard,
        addColumn,
        updateColumn,
        deleteColumn,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within a BoardProvider');
  return ctx;
}
