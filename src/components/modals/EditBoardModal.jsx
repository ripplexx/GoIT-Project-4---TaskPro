import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBoard } from '../../context/BoardContext';
import { boardSchema } from '../../utils/validationSchemas';
import { BOARD_ICONS, BOARD_ICON_EMOJIS, BOARD_BACKGROUNDS } from '../../constants/boardIcons';
import Modal from './Modal';
import styles from './FormModal.module.css';

const EditBoardModal = ({ board, onClose }) => {
    const { updateBoard } = useBoard();
    const [submitError, setSubmitError] = useState(null);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(boardSchema),
        defaultValues: { title: board.title, icon: board.icon, background: board.background },
    });

    const selectedIcon = watch('icon');
    const selectedBg = watch('background');

    const onSubmit = async (data) => {
        setSubmitError(null);
        try {
            await updateBoard(board.id, data);
            onClose();
        } catch (err) {
            setSubmitError(err.message || 'Failed to update board. Please try again.');
        }
    };

    return (
        <Modal title="Edit board" onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.field}>
                    <input className={`${styles.input} ${errors.title ? styles.inputError : ''}`} {...register('title')} />
                    {errors.title && <span className={styles.error}>{errors.title.message}</span>}
                </div>

                <div className={styles.section}>
                    <p className={styles.sectionLabel}>Icons</p>
                    <div className={styles.iconGrid} role="radiogroup" aria-label="Board icon">
                        {BOARD_ICONS.map((icon) => (
                            <label key={icon} className={`${styles.iconBtn} ${selectedIcon === icon ? styles.selected : ''}`}>
                                <input
                                    type="radio"
                                    value={icon}
                                    className={styles.srOnly}
                                    {...register('icon')}
                                />
                                {BOARD_ICON_EMOJIS[icon]}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <p className={styles.sectionLabel}>Background</p>
                    <div className={styles.bgGrid} role="radiogroup" aria-label="Board background">
                        {BOARD_BACKGROUNDS.map((bg, i) => (
                            <label key={i} className={`${styles.bgBtn} ${selectedBg === bg ? styles.selected : ''}`}>
                                <input
                                    type="radio"
                                    value={bg}
                                    className={styles.srOnly}
                                    {...register('background')}
                                />
                                {bg ? (
                                    <img
                                        src={bg}
                                        alt=""
                                        className={styles.bgPreview}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <span className={styles.noBg}>∅</span>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                {submitError && <span className={styles.error}>{submitError}</span>}

                <button type="submit" className={styles.submit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Edit'}
                </button>
            </form>
        </Modal>
    );
};

export default EditBoardModal;
