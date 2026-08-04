'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface DeleteModalProps {
  isOpen: boolean;
  bookTitle: string;
  isDeleting: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({
  isOpen,
  bookTitle,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete this book?">
      <p className="text-sm text-muted">
        <span className="font-medium text-ink">{bookTitle}</span> will be removed from
        your shelf. This cannot be undone.
      </p>

      {error && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" isLoading={isDeleting} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
