import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { sendHelpRequest } from '../../api/help.api';
import Modal from './Modal';
import styles from './FormModal.module.css';

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    comment: yup.string().required('Comment is required').min(10, 'Min 10 characters'),
});

const NeedHelpModal = ({ onClose }) => {
    const [submitError, setSubmitError] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await sendHelpRequest(data);
            onClose();
        } catch {
            setSubmitError('Something went wrong. Please try again.');
        }
    };

    return (
        <Modal title="Need help" onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.field}>
                    <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`} type="email" placeholder="Email address" {...register('email')} />
                    {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                </div>
                <div className={styles.field}>
                    <textarea className={`${styles.textarea} ${errors.comment ? styles.inputError : ''}`} placeholder="Comment" {...register('comment')} />
                    {errors.comment && <span className={styles.error}>{errors.comment.message}</span>}
                </div>
                {submitError && <span className={styles.error}>{submitError}</span>}
                <button type="submit" className={styles.submit} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send'}
                </button>
            </form>
        </Modal>
    );
};

export default NeedHelpModal;
