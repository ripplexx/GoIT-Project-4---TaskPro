import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../pages/AuthPage/authSchemas';
import EyeIcon from '../EyeIcon/EyeIcon';
import styles from '../../pages/AuthPage/AuthPage.module.css';

export default function LoginForm() {
  const { login, isLoading, error: authError } = useAuth();
  const [localError, setLocalError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data) {
    setLocalError(null);
    try {
      await login({ email: data.email, password: data.password });
    } catch (err) {
      setLocalError(err.message);
    }
  }

  const error = localError || authError;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      {error && <p className={styles.error} aria-live="polite">{error}</p>}

      <div className={styles.field}>
        <input
          id="login-email"
          {...field('email')}
          type="email"
          placeholder="Enter your email"
          aria-label="Email"
          className={styles.input}
          autoComplete="email"
        />
        {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <div className={styles.passwordField}>
          <input
            id="login-password"
            {...field('password')}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Enter your password"
            aria-label="Password"
            className={`${styles.input} ${styles.passwordInput}`}
            autoComplete="current-password"
          />
          <button
            type="button"
            className={styles.visibilityBtn}
            onClick={() => setIsPasswordVisible((value) => !value)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isPasswordVisible}
          >
            <EyeIcon isVisible={isPasswordVisible} />
          </button>
        </div>
        {errors.password && <span className={styles.fieldError}>{errors.password.message}</span>}
      </div>

      <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
        {isLoading ? 'Please wait…' : 'Log In Now'}
      </button>
    </form>
  );
}
