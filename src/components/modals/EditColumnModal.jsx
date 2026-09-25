import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Icon from '../Icon/Icon';
import { columnSchema } from '../../utils/validationSchemas';
import styles from './ColumnModal.module.css';

export default function EditColumnModal({ column, onClose, onSubmit }) {
  const [submitError, setSubmitError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(columnSchema),
    defaultValues: { title: column.title || '' },
  });

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const onValid = async (data) => {
    setSubmitError(null);
    try {
      await onSubmit(column.id, data);
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to update column. Please try again.');
    }
  };

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Edit column</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <Icon name="close" size={18} />
        </button>

        <form className={styles.form} onSubmit={handleSubmit(onValid)}>
          <div>
            <input
              className={styles.input}
              type="text"
              placeholder="Title"
              {...register('title')}
              autoFocus
            />
            {errors.title && <span className={styles.error}>{errors.title.message}</span>}
          </div>

          {submitError && <span className={styles.error}>{submitError}</span>}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            <span className={styles.submitPlus}>+</span>
            {isSubmitting ? 'Saving...' : 'Edit'}
          </button>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
