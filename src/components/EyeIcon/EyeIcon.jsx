import Icon from '../Icon/Icon';
import styles from '../../pages/AuthPage/AuthPage.module.css';

export default function EyeIcon({ isVisible }) {
  return (
    <Icon
      name={isVisible ? 'eye' : 'eye-off'}
      className={styles.visibilityIcon}
    />
  );
}
