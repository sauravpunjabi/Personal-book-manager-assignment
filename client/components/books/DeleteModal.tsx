'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface DeleteModalProps {
  isOpen: boolean;
  bookTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** No spinner needed: confirming only queues the removal, undo covers the rest */
export function DeleteModal({
  isOpen,
  bookTitle,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Remove this book?">
      <p className="text-[13.5px] leading-[1.6] text-ink-2">
        <span className="font-medium text-ink">{bookTitle}</span> comes off your shelf.
        You will have a moment to undo it.
      </p>

      <div className="mt-6 flex justify-end gap-2.5">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remove
        </Button>
      </div>
    </Modal>
  );
}
