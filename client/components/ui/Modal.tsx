'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useDialogBehaviour } from '@/hooks/useDialogBehaviour';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useDialogBehaviour(isOpen, onClose);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return null;
  }

  const duration = reduceMotion ? 0 : 0.18;

  return createPortal(
    // AnimatePresence needs a keyed motion child or the overlay never unmounts
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
        >
          <div className="absolute inset-0 bg-[rgba(28,24,20,.38)]" onClick={onClose} />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex h-full w-full flex-col overflow-y-auto bg-surface p-6 sm:h-auto sm:max-h-[88vh] sm:max-w-[520px] sm:rounded-[20px] sm:border sm:border-line sm:p-7 sm:shadow-[var(--shadow-3)]"
            initial={reduceMotion ? false : { y: 12 }}
            animate={{ y: 0 }}
            exit={reduceMotion ? undefined : { y: 12 }}
            transition={{ duration }}
          >
            <h2 id={titleId} className="font-display text-[23px] tracking-[-0.015em]">
              {title}
            </h2>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
