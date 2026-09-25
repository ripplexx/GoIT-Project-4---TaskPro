import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default HomePage;
