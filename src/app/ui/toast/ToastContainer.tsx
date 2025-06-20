'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';
import styles from './toast-container.module.css';

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className={styles.toastContainer}>
      <AnimatePresence>
        {toasts.map(({ id, message, type }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }} className={`${styles.toast} ${styles[type]}`}
          >
            <span>{message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
