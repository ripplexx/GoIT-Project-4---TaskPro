import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useBoard } from '../../context/BoardContext';
import { boardSchema } from '../../utils/validationSchemas';
import { BOARD_ICONS, BOARD_ICON_EMOJIS, BOARD_BACKGROUNDS } from '../../constants/boardIcons';
import Modal from './Modal';
import styles from './FormModal.module.css';

const AddBoardModal = ({ onClose }) => {
    const { createBoard } = useBoard();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState(null);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(boardSchema),
        defaultValues: { icon: 'icon-project', background: '' },
    });

    const selectedIcon = watch('icon');
    const selectedBg = watch('background');

    const onSubmit = async (data) => {
        setSubmitError(null);
        try {
            const board = await createBoard(data);
            navigate(`/home/${board.id}`);
            onClose();
        } catch (err) {
            setSubmitError(err.message || 'Failed to create board. Please try again.');
        }
    };

    return (
        <Modal title="New board" onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.field}>
                    <input
                        className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                        placeholder="Title"
                        {...register('title')}
                    />
                    {errors.title && <span className={styles.error}>{errors.title.message}</span>}
                </div>

                <div className={styles.section}>
                    <p className={styles.sectionLabel}>Icons</p>
                    <div className={styles.iconGrid} role="radiogroup" aria-label="Board icon">
                        {BOARD_ICONS.map((icon) => (
                            <label
                                key={icon}
                                className={`${styles.iconBtn} ${selectedIcon === icon ? styles.selected : ''}`}
                                title={icon}
                            >
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
                            <label
                                key={i}
                                className={`${styles.bgBtn} ${selectedBg === bg ? styles.selected : ''}`}
                                title={bg || 'No background'}
                            >
                                <input
                                    type="radio"
                                    value={bg}
                                    className={styles.srOnly}
                                    {...register('background')}
                                />
                                {bg ? (
                                    <img
                                        src={bg}
                                        alt={`background ${i}`}
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
                    <span className={styles.submitPlus}>+</span>
                    {isSubmitting ? 'Creating...' : 'Create'}
                </button>
            </form>
        </Modal>
    );
};

export default AddBoardModal;
