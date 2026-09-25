import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format, isToday, parseISO } from 'date-fns';
import Icon from '../Icon/Icon';
import Calendar from '../Calendar/Calendar';
import { cardSchema } from '../../utils/validationSchemas';
import styles from './CardModal.module.css';

const PRIORITIES = [
  { value: 'low',     cssVar: 'var(--priority-low)' },
  { value: 'medium',  cssVar: 'var(--priority-medium)' },
  { value: 'high',    cssVar: 'var(--priority-high)' },
  { value: 'without', cssVar: 'var(--priority-without)' },
];

function formatDeadlineDisplay(dateString) {
  if (!dateString) return null;
  const date = parseISO(dateString);
  if (isToday(date)) return `Today, ${format(date, 'MMMM d')}`;
  return format(date, 'EEEE, MMMM d');
}

export default function EditCardModal({ card, onClose, onSubmit }) {
  const [deadline, setDeadline] = useState(card.deadline || '');
  const [showCalendar, setShowCalendar] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(cardSchema),
    defaultValues: {
      title: card.title || '',
      description: card.description || '',
      priority: card.priority || 'without',
      deadline: card.deadline || null,
    },
  });

  const priority = watch('priority');

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const onValid = async (data) => {
    setSubmitError(null);
    try {
      await onSubmit({ ...data, deadline: deadline || null });
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to update card. Please try again.');
    }
  };

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Edit card</h2>
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

          <textarea
            className={styles.textarea}
            placeholder="Description"
            {...register('description')}
          />

          <div className={styles.section}>
            <p className={styles.label}>Label color</p>
            <div className={styles.priorities}>
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  className={`${styles.priorityBtn} ${priority === p.value ? styles.selected : ''}`}
                  style={{ background: p.cssVar }}
                  onClick={() => setValue('priority', p.value)}
                  aria-label={p.value}
                />
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.label}>Deadline</p>
            <button
              type="button"
              className={deadline ? styles.deadlineValue : styles.deadlinePlaceholder}
              onClick={() => setShowCalendar(true)}
            >
              {deadline ? formatDeadlineDisplay(deadline) : 'Select a date'}
            </button>
          </div>

          {submitError && <span className={styles.error}>{submitError}</span>}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            <span className={styles.submitPlus}>+</span>
            {isSubmitting ? 'Saving...' : 'Edit'}
          </button>
        </form>
      </div>

      {showCalendar && (
        <Calendar
          value={deadline}
          minDate={today}
          onChange={(date) => setDeadline(date)}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>,
    document.getElementById('modal-root')
  );
}
