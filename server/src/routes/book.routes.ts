import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
  updateStatus,
} from '../controllers/book.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Nothing here is public — a book always belongs to somebody.
router.use(protect);

router.route('/').get(getBooks).post(createBook);
router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);
router.patch('/:id/status', updateStatus);

export default router;
